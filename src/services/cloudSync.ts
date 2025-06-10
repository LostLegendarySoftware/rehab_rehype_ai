import { toast } from 'react-hot-toast';

export interface CloudSyncConfig {
  apiEndpoint: string;
  apiKey: string;
  userId: string;
}

export class CloudSyncService {
  private config: CloudSyncConfig;
  private syncQueue: Array<{ action: string; data: any; timestamp: number }> = [];
  private isOnline = navigator.onLine;
  private db: IDBDatabase | null = null;

  constructor(config: CloudSyncConfig) {
    this.config = config;
    this.setupEventListeners();
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      const request = indexedDB.open('RehabRehypeDB', 1);
      
      request.onerror = () => {
        console.warn('IndexedDB not available');
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.loadSyncQueue();
      };
    } catch (error) {
      console.warn('Failed to initialize IndexedDB:', error);
    }
  }

  private async loadSyncQueue() {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.get('queue');

      request.onsuccess = () => {
        if (request.result && request.result.data) {
          this.syncQueue = request.result.data;
          if (this.isOnline) {
            this.processSyncQueue();
          }
        }
      };
    } catch (error) {
      console.warn('Failed to load sync queue:', error);
    }
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
      toast.success('Back online - syncing data...');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      toast.info('Working offline - changes will sync when reconnected');
    });
  }

  async syncProject(project: any): Promise<void> {
    const syncData = {
      action: 'sync_project',
      data: project,
      timestamp: Date.now()
    };

    if (this.isOnline) {
      try {
        await this.sendToCloud(syncData);
        toast.success('Project synced successfully');
      } catch (error) {
        this.addToSyncQueue(syncData);
        toast.error('Sync failed - queued for retry');
        throw error;
      }
    } else {
      this.addToSyncQueue(syncData);
      toast.info('Project queued for sync when online');
    }
  }

  async uploadAudioFile(file: File, projectId: string): Promise<string> {
    if (!this.isOnline) {
      throw new Error('Upload requires internet connection');
    }

    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('projectId', projectId);
      formData.append('userId', this.config.userId);

      const response = await fetch(`${this.config.apiEndpoint}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success('File uploaded successfully');
      return result.fileUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('File upload failed');
      throw error;
    }
  }

  async shareProject(projectId: string, collaboratorEmail: string, permissions: string[]): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Sharing requires internet connection');
    }

    try {
      const response = await fetch(`${this.config.apiEndpoint}/projects/${projectId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          collaboratorEmail,
          permissions,
          userId: this.config.userId
        })
      });

      if (!response.ok) {
        throw new Error(`Sharing failed: ${response.statusText}`);
      }

      toast.success(`Project shared with ${collaboratorEmail}`);
    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error('Failed to share project');
      throw error;
    }
  }

  async getSharedProjects(): Promise<any[]> {
    if (!this.isOnline) {
      return this.getOfflineProjects();
    }

    try {
      const response = await fetch(`${this.config.apiEndpoint}/projects/shared`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch shared projects: ${response.statusText}`);
      }

      const projects = await response.json();
      this.cacheProjects(projects);
      return projects;
    } catch (error) {
      console.error('Failed to fetch shared projects:', error);
      toast.error('Failed to load shared projects');
      return this.getOfflineProjects();
    }
  }

  private async getOfflineProjects(): Promise<any[]> {
    if (!this.db) return [];

    try {
      const transaction = this.db.transaction(['projects'], 'readonly');
      const store = transaction.objectStore('projects');
      const request = store.getAll();

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = () => {
          resolve([]);
        };
      });
    } catch (error) {
      console.warn('Failed to get offline projects:', error);
      return [];
    }
  }

  private async cacheProjects(projects: any[]): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['projects'], 'readwrite');
      const store = transaction.objectStore('projects');
      
      projects.forEach(project => {
        store.put(project);
      });
    } catch (error) {
      console.warn('Failed to cache projects:', error);
    }
  }

  private async sendToCloud(data: any): Promise<void> {
    const response = await fetch(`${this.config.apiEndpoint}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Cloud sync failed: ${response.statusText}`);
    }
  }

  private addToSyncQueue(data: any): void {
    this.syncQueue.push(data);
    this.persistSyncQueue();
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    const itemsToProcess = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of itemsToProcess) {
      try {
        await this.sendToCloud(item);
      } catch (error) {
        console.error('Failed to sync item:', error);
        this.syncQueue.push(item); // Re-add failed items
      }
    }

    this.persistSyncQueue();
  }

  private async persistSyncQueue(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      store.put({ id: 'queue', data: this.syncQueue });
    } catch (error) {
      console.warn('Failed to persist sync queue:', error);
    }
  }

  dispose() {
    if (this.db) {
      this.db.close();
    }
  }
}

// Create a default instance for demo purposes
export const cloudSync = new CloudSyncService({
  apiEndpoint: 'https://api.rehabrehype.com',
  apiKey: 'demo-api-key',
  userId: 'demo-user-1'
});