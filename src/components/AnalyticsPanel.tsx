import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, Download, Star, Target, Zap } from 'lucide-react';

interface AnalyticsData {
  totalProjects: number;
  totalProcessingTime: number;
  averageQualityImprovement: number;
  popularGenres: Array<{ name: string; count: number; percentage: number }>;
  monthlyUsage: Array<{ month: string; projects: number; hours: number }>;
  userSatisfaction: number;
  exportStats: Array<{ format: string; count: number }>;
}

interface AnalyticsPanelProps {
  data: AnalyticsData;
}

export default function AnalyticsPanel({ data }: AnalyticsPanelProps) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{data.totalProjects}</div>
              <div className="text-sm text-purple-400">Total Projects</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">+23% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-xl p-6 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-600/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{Math.round(data.totalProcessingTime)}h</div>
              <div className="text-sm text-cyan-400">Processing Time</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">Avg 4.2min/track</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 rounded-xl p-6 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-600/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{data.averageQualityImprovement}%</div>
              <div className="text-sm text-emerald-400">Quality Boost</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">Industry leading</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-600/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{data.userSatisfaction}/5</div>
              <div className="text-sm text-yellow-400">User Rating</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">98% satisfaction</span>
          </div>
        </div>
      </div>

      {/* Usage Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <span>Monthly Usage Trends</span>
          </h3>
          
          <div className="space-y-4">
            {data.monthlyUsage.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        style={{ width: `${(month.projects / Math.max(...data.monthlyUsage.map(m => m.projects))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{month.projects} projects</span>
                  </div>
                  <span className="text-sm text-gray-500">{month.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Popular Genres</span>
          </h3>
          
          <div className="space-y-4">
            {data.popularGenres.map((genre, index) => (
              <div key={genre.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-medium">{genre.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">{genre.count} tracks</span>
                    <span className="text-sm text-cyan-400">{genre.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Statistics */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Download className="w-6 h-6 text-emerald-400" />
          <span>Export Format Distribution</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.exportStats.map((format, index) => {
            const colors = [
              'from-purple-500 to-purple-600',
              'from-cyan-500 to-cyan-600',
              'from-emerald-500 to-emerald-600',
              'from-yellow-500 to-yellow-600'
            ];
            
            return (
              <div key={format.format} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${colors[index % colors.length]} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{format.count}</span>
                </div>
                <div className="text-sm font-medium text-gray-300 uppercase">{format.format}</div>
                <div className="text-xs text-gray-500">exports</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-600/10 to-purple-800/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">Processing Speed</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">3.2x</div>
            <div className="text-sm text-gray-400">Faster than industry average</div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-600/10 to-cyan-800/10 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">Accuracy Rate</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">99.7%</div>
            <div className="text-sm text-gray-400">AI processing accuracy</div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-600/10 to-emerald-800/10 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">Quality Score</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">9.8/10</div>
            <div className="text-sm text-gray-400">Average output quality</div>
          </div>
        </div>
      </div>
    </div>
  );
}