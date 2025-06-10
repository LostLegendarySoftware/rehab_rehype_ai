import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Save, RotateCcw, Settings, Headphones, Radio, Zap, Crown, Target } from 'lucide-react';

export default function RecordTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputLevel, setInputLevel] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recordingQuality, setRecordingQuality] = useState('professional');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Simulate input level fluctuation
        setInputLevel(Math.random() * 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecord = () => {
    setIsRecording(true);
    setIsPaused(false);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Professional Recording Studio Header */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <Radio className="w-6 h-6 text-red-400" />
            <span>Professional Recording Studio</span>
            <Crown className="w-6 h-6 text-yellow-400" />
          </h2>
          <p className="text-gray-400">Broadcast-quality recording with real-time monitoring and AI enhancement</p>
        </div>

        {/* Advanced Waveform Visualization */}
        <div className="bg-gray-900/80 rounded-xl p-8 mb-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-white font-semibold">
                {isRecording ? (isPaused ? 'PAUSED' : 'RECORDING') : 'READY'}
              </span>
            </div>
            <div className="text-3xl font-mono text-white bg-gray-800/50 px-6 py-2 rounded-lg border border-gray-600/50">
              {formatTime(recordingTime)}
            </div>
          </div>
          
          <div className="flex items-center justify-center h-40 bg-gray-800/50 rounded-lg border border-gray-600/30">
            {isRecording ? (
              <div className="flex items-end space-x-1 h-32">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full transition-all duration-75"
                    style={{
                      width: '3px',
                      height: `${Math.random() * 120 + 10}px`,
                      opacity: Math.random() * 0.8 + 0.2,
                      animationDelay: `${i * 20}ms`
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <Mic className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Ready to capture your masterpiece</p>
                <p className="text-gray-600 text-sm mt-2">Professional studio-grade recording</p>
              </div>
            )}
          </div>

          {/* Input Level Meter */}
          <div className="mt-6 flex items-center space-x-4">
            <span className="text-sm text-gray-400 w-16">INPUT</span>
            <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ${
                  inputLevel > 80 ? 'bg-red-500' : inputLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${inputLevel}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-12">{Math.round(inputLevel)}%</span>
          </div>
        </div>

        {/* Professional Recording Controls */}
        <div className="flex items-center justify-center space-x-6">
          {!isRecording ? (
            <button
              onClick={handleStartRecord}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              <Mic className="w-6 h-6" />
              <span className="font-semibold text-lg">Start Recording</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                <span className="font-semibold">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={handleStopRecord}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg"
              >
                <Square className="w-5 h-5" />
                <span className="font-semibold">Stop</span>
              </button>
            </>
          )}
          
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-semibold">Reset</span>
          </button>

          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${
              isMonitoring 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Headphones className="w-5 h-5" />
            <span className="font-semibold">Monitor</span>
          </button>
        </div>
      </div>

      {/* Professional Audio Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>Recording Quality</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Quality Preset</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'broadcast', name: 'Broadcast Quality', desc: '48kHz/24-bit - Radio/TV standard', color: 'from-red-500 to-orange-500' },
                  { id: 'professional', name: 'Professional Studio', desc: '96kHz/32-bit - Industry standard', color: 'from-purple-500 to-cyan-500' },
                  { id: 'mastering', name: 'Mastering Grade', desc: '192kHz/32-bit Float - Ultimate quality', color: 'from-yellow-500 to-red-500' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setRecordingQuality(preset.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      recordingQuality === preset.id
                        ? `bg-gradient-to-r ${preset.color} text-white border-transparent shadow-lg`
                        : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                    }`}
                  >
                    <div className="font-semibold text-white mb-1">{preset.name}</div>
                    <div className="text-sm text-gray-300">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Sample Rate</label>
                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white backdrop-blur-sm">
                  <option>192 kHz (Ultra High-Res)</option>
                  <option>96 kHz (High-Res)</option>
                  <option>48 kHz (Professional)</option>
                  <option>44.1 kHz (CD Quality)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Bit Depth</label>
                <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white backdrop-blur-sm">
                  <option>32-bit Float (Maximum)</option>
                  <option>24-bit (Professional)</option>
                  <option>16-bit (Standard)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Target className="w-6 h-6 text-emerald-400" />
            <span>Input Monitoring</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Input Gain: {Math.round(inputLevel)}dB
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={inputLevel - 50}
                onChange={(e) => setInputLevel(Number(e.target.value) + 50)}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none slider cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>-20dB</span>
                <span>0dB</span>
                <span>+20dB</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Monitor Level</label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="75"
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none slider cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Latency Compensation</label>
              <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white backdrop-blur-sm">
                <option>Ultra Low (2ms)</option>
                <option>Low (5ms)</option>
                <option>Normal (10ms)</option>
                <option>High Quality (20ms)</option>
              </select>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Real-time noise reduction', checked: true },
                { label: 'Auto-gain control', checked: false },
                { label: 'Limiter protection', checked: true },
                { label: 'Phase correction', checked: false }
              ].map((option, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500" 
                    defaultChecked={option.checked} 
                  />
                  <span className="text-gray-300 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Song Completion */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-purple-400" />
          <span>AI Song Completion & Enhancement</span>
          <Crown className="w-6 h-6 text-yellow-400" />
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform incomplete recordings into professional masterpieces using advanced AI music generation. 
              Our system analyzes your musical style, key, tempo, and emotional content to create seamless completions.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-gray-300">Intelligent arrangement completion</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span className="text-gray-300">Style-matched instrumentation</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-gray-300">Professional mixing integration</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Completion Style</label>
              <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white backdrop-blur-sm">
                <option>Match existing style</option>
                <option>Enhance with modern production</option>
                <option>Add orchestral elements</option>
                <option>Electronic/synthetic completion</option>
                <option>Acoustic/organic finish</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Creativity Level</label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="7"
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none slider cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Innovative</span>
              </div>
            </div>
            
            <button className="w-full py-4 bg-gradient-to-r from-purple-600 via-cyan-600 to-emerald-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Generate AI Completion</span>
              <Crown className="w-5 h-5 text-yellow-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}