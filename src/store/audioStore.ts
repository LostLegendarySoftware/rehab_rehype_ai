import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AudioProject {
  id: string;
  name: string;
  originalFile?: File;
  processedFile?: Blob;
  metadata: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    year: number;
    duration: number;
    sampleRate: number;
    bitDepth: number;
  };
  processing: {
    enhancementLevel: number;
    targetGenre: string;
    dolbyProcessing: string;
    separatedTracks?: {
      vocals: Blob;
      instruments: Blob;
      drums: Blob;
      bass: Blob;
    };
  };
  collaboration: {
    isShared: boolean;
    collaborators: string[];
    permissions: Record<string, string[]>;
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AudioState {
  currentProject: AudioProject | null;
  projects: AudioProject[];
  isProcessing: boolean;
  processingStage: string;
  user: {
    id: string;
    email: string;
    subscription: 'free' | 'pro' | 'enterprise';
    credits: number;
  } | null;
  
  // Actions
  setCurrentProject: (project: AudioProject | null) => void;
  addProject: (project: AudioProject) => void;
  updateProject: (id: string, updates: Partial<AudioProject>) => void;
  deleteProject: (id: string) => void;
  setProcessing: (isProcessing: boolean, stage?: string) => void;
  setUser: (user: AudioState['user']) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      projects: [],
      isProcessing: false,
      processingStage: '',
      user: null,

      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project],
        currentProject: project
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates, updatedAt: new Date() }
          : state.currentProject
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),
      
      setProcessing: (isProcessing, stage = '') => set({ 
        isProcessing, 
        processingStage: stage 
      }),
      
      setUser: (user) => set({ user })
    }),
    {
      name: 'rehab-rehype-storage',
      partialize: (state) => ({
        projects: state.projects,
        user: state.user
      })
    }
  )
);