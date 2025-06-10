import React, { useState } from 'react';
import { Users, Share2, MessageCircle, Clock, Eye, Edit, Crown, Mail, Plus, X } from 'lucide-react';

interface Collaborator {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  lastActive: Date;
  isOnline: boolean;
}

interface CollaborationPanelProps {
  projectId: string;
  collaborators: Collaborator[];
  onInvite: (email: string, role: string) => void;
  onRemove: (collaboratorId: string) => void;
  onRoleChange: (collaboratorId: string, newRole: string) => void;
}

export default function CollaborationPanel({ 
  projectId, 
  collaborators, 
  onInvite, 
  onRemove, 
  onRoleChange 
}: CollaborationPanelProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [showComments, setShowComments] = useState(false);

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInvite(inviteEmail, inviteRole);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'editor': return Edit;
      case 'viewer': return Eye;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-400';
      case 'editor': return 'text-purple-400';
      case 'viewer': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-cyan-400" />
          <span>Team Collaboration</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Invite</span>
          </button>
        </div>
      </div>

      {/* Active Collaborators */}
      <div className="space-y-4 mb-6">
        {collaborators.map((collaborator) => {
          const RoleIcon = getRoleIcon(collaborator.role);
          const roleColor = getRoleColor(collaborator.role);

          return (
            <div key={collaborator.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {collaborator.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {collaborator.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-800" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{collaborator.name}</span>
                    <RoleIcon className={`w-4 h-4 ${roleColor}`} />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{collaborator.email}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {collaborator.isOnline 
                          ? 'Online now' 
                          : `Last seen ${collaborator.lastActive.toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {collaborator.role !== 'owner' && (
                  <>
                    <select
                      value={collaborator.role}
                      onChange={(e) => onRoleChange(collaborator.id, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => onRemove(collaborator.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-gray-700/20 rounded-xl p-4 border border-gray-600/30">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Recent Activity</span>
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span>Sarah enhanced the vocal track</span>
            <span className="text-xs">2 min ago</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>Mike added a comment on the bridge</span>
            <span className="text-xs">5 min ago</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <span>Alex exported the final mix</span>
            <span className="text-xs">1 hour ago</span>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Invite Collaborator</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white"
                >
                  <option value="viewer">Viewer - Can view and comment</option>
                  <option value="editor">Editor - Can edit and modify</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {showComments && (
        <div className="mt-6 bg-gray-700/20 rounded-xl p-4 border border-gray-600/30">
          <h4 className="text-sm font-semibold text-gray-300 mb-4">Project Comments</h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white">Sarah</span>
                <span className="text-xs text-gray-500">2:30 PM</span>
              </div>
              <p className="text-sm text-gray-300">The vocal enhancement sounds amazing! Maybe we could add a bit more reverb to the chorus?</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-white">Mike</span>
                <span className="text-xs text-gray-500">1:45 PM</span>
              </div>
              <p className="text-sm text-gray-300">Great work on the separation! The drums are much cleaner now.</p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:border-purple-400 focus:outline-none"
            />
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}