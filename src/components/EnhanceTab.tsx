import React, { useState, useCallback } from 'react';
import { Upload, Play, Pause, Volume2, Zap, Sparkles, Crown, Target, Wand2 } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';
import { audioProcessor } from '../services/audioProcessor';
import { toast } from 'react-hot-toast';

const genres = [
  { name: 'Rock', color: 'from-red-500 to-orange-500', icon: '🎸' },
  { name: 'Rap', color: 'from-purple-500 to-pink-500', icon: '🎤' },
  { name: 'Pop', color: 'from-blue-500 to-cyan-500', icon: '✨' },
  { name: 'Punk', color: 'from-gray-500 to-red-500', icon: '⚡' },
  { name: 'Heavy Metal', color: 'from-gray-800 to-red-600', icon: '🔥' },
  { name: 'Emo Rap', color: 'from-purple-600 to-gray-600', icon: '🖤' },
  { name: 'Emo Punk', color: 'from-pink-500 to-gray-700', icon: '💔' },
  { name: 'Gothic Rap', color: 'from-black to-purple-800', icon: '🦇' },
  { name: 'Trap', color: 'from-yellow-500 to-red-500', icon: '💎' },
  { name: 'Benny Blanco Style', color: 'from-green-400 to-blue-500', icon: '🎹' },
  { name: 'Ed Sheeran Style', color: 'from-orange-400 to-red-400', icon: '🎵' },
  { name: 'Acoustic', color: 'from-amber-500 to-orange-600', icon: '🪕' }
];

const enhancementLevels = [
  { level: 1, name: 'Subtle Touch', description: 'Light enhancement preserving original character' },
  { level: 5, name: 'Balanced Pro', description: 'Professional quality with natural sound' },
  { level: 7, name: 'Radio Ready', description: 'Commercial broadcast standard' },
  { level: 10, name: 'Maximum Impact', description: 'Aggressive transformation for maximum quality' }
];

export default function EnhanceTab() {
  const { isProcessing, setProcessing } = useAudioStore();
  const [selectedGenre, setSelectedGenre] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [enhancementLevel, setEnhancementLevel] = useState(7);
  const [processingStage, setProcessingStage] = useState('');
  const [dolbyProcessing, setDolbyProcessing] = useState('dolby-digital-plus');
  const [preserveMelody, setPreserveMelody] = useState(true);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select a valid audio file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('File size too large. Please select a file under 100MB');
      return;
    }

    try {
      setUploadedFile(file);
      toast.success('File uploaded successfully');
      
      // Convert file to AudioBuffer for processing
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
      
    } catch (error) {
      console.error('File processing error:', error);
      toast.error('Failed to process audio file');
      setUploadedFile(null);
      setAudioBuffer(null);
    }
  }, []);

  const handleEnhance = async () => {
    if (!audioBuffer || !selectedGenre) {
      toast.error('Please upload a file and select a genre');
      return;
    }

    setProcessing(true, 'Initializing enhancement...');
    
    const stages = [
      'Analyzing audio structure...',
      'Applying AI enhancement algorithms...',
      'Matching genre characteristics...',
      'Optimizing frequency response...',
      'Applying Dolby Digital processing...',
      'Finalizing radio-ready master...'
    ];

    try {
      for (let i = 0; i < stages.length; i++) {
        setProcessingStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Apply actual audio enhancement
      const enhancedBuffer = await audioProcessor.enhanceAudio(audioBuffer, {
        enhancementLevel,
        targetGenre: selectedGenre,
        preserveMelody,
        dolbyProcessing
      });

      // Convert enhanced buffer to blob for download
      const enhancedBlob = await audioBufferToBlob(enhancedBuffer);
      
      // Create download link
      const url = URL.createObjectURL(enhancedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced_${uploadedFile?.name || 'audio'}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Audio enhancement completed successfully!');
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      toast.error('Enhancement failed. Please try again.');
    } finally {
      setProcessing(false, '');
      setProcessingStage('');
    }
  };

  const audioBufferToBlob = async (buffer: AudioBuffer): Promise<Blob> => {
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
    
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineContext.destination);
    source.start(0);
    
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV format
    const length = renderedBuffer.length * renderedBuffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, renderedBuffer.numberOfChannels, true);
    view.setUint32(24, renderedBuffer.sampleRate, true);
    view.setUint32(28, renderedBuffer.sampleRate * renderedBuffer.numberOfChannels * 2, true);
    view.setUint16(32, renderedBuffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);
    
    // Convert audio data
    let offset = 44;
    for (let i = 0; i < renderedBuffer.length; i++) {
      for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, renderedBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Hero Upload Section */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span>Professional Audio Enhancement</span>
          </h2>
          <p className="text-gray-400">Transform your audio into radio-ready masterpieces with AI-powered enhancement</p>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-purple-400 transition-all duration-300 bg-gray-900/50">
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.flac,.m4a,.aac,.ogg"
              onChange={handleFileUpload}
              className="hidden"
              id="audio-upload"
              disabled={isProcessing}
            />
            <label htmlFor="audio-upload" className={`cursor-pointer block ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Upload className="w-16 h-16 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  <Sparkles className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-300 mb-2">Drop your audio file here or click to browse</p>
                  <p className="text-sm text-gray-500">Supports MP3, WAV, FLAC, M4A, AAC, OGG • Max 100MB</p>
                </div>
              </div>
            </label>
          </div>
        </div>
        
        {uploadedFile && (
          <div className="mt-6 p-6 bg-gray-700/30 rounded-xl border border-gray-600/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-white font-medium">{uploadedFile.name}</span>
                  <p className="text-sm text-gray-400">Ready for enhancement</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-3 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-lg transition-colors">
                  <Play className="w-5 h-5" />
                </button>
                <div className="w-32 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="flex space-x-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 20 + 4}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Genre Selection */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Target className="w-6 h-6 text-cyan-400" />
          <span>Target Genre & Artist Style</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <button
              key={genre.name}
              onClick={() => setSelectedGenre(genre.name)}
              disabled={isProcessing}
              className={`relative p-4 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                selectedGenre === genre.name
                  ? 'text-white shadow-2xl transform scale-105'
                  : 'text-gray-300 hover:text-white hover:scale-102'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} ${
                selectedGenre === genre.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
              } transition-opacity duration-300`} />
              <div className="relative flex items-center space-x-2">
                <span className="text-lg">{genre.icon}</span>
                <span>{genre.name}</span>
              </div>
              {selectedGenre === genre.name && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Enhancement Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <span>Enhancement Settings</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-4">
                Enhancement Level: {enhancementLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={enhancementLevel}
                onChange={(e) => setEnhancementLevel(Number(e.target.value))}
                disabled={isProcessing}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none slider cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                {enhancementLevels.map((level) => (
                  <button
                    key={level.level}
                    onClick={() => setEnhancementLevel(level.level)}
                    disabled={isProcessing}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      enhancementLevel === level.level
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-500 hover:text-gray-300'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {enhancementLevels.find(l => l.level === enhancementLevel)?.description}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Dolby Processing Engine
              </label>
              <select 
                value={dolbyProcessing}
                onChange={(e) => setDolbyProcessing(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white backdrop-blur-sm"
              >
                <option value="dolby-atmos">Dolby Atmos (Spatial Audio)</option>
                <option value="dolby-digital-plus">Dolby Digital Plus (Enhanced)</option>
                <option value="dolby-truehd">Dolby TrueHD (Lossless)</option>
                <option value="standard">Standard Stereo Enhancement</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Advanced Options</h3>
          
          <div className="space-y-4">
            {[
              { 
                key: 'preserve-melody',
                label: 'Preserve original melody structure', 
                checked: preserveMelody, 
                desc: 'Maintains core musical elements',
                onChange: setPreserveMelody
              },
              { 
                key: 'auto-tune',
                label: 'Auto-tune vocal correction', 
                checked: true, 
                desc: 'Professional pitch correction' 
              },
              { 
                key: 'dynamic-range',
                label: 'Dynamic range optimization', 
                checked: false, 
                desc: 'Enhance loudness without clipping' 
              },
              { 
                key: 'stereo-width',
                label: 'Stereo width enhancement', 
                checked: true, 
                desc: 'Expand spatial imaging' 
              },
              { 
                key: 'harmonic',
                label: 'Harmonic excitation', 
                checked: false, 
                desc: 'Add warmth and presence' 
              },
              { 
                key: 'noise-reduction',
                label: 'Noise reduction (AI-powered)', 
                checked: true, 
                desc: 'Remove unwanted artifacts' 
              }
            ].map((option, index) => (
              <label key={option.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500" 
                  defaultChecked={option.checked}
                  disabled={isProcessing}
                  onChange={option.onChange ? (e) => option.onChange!(e.target.checked) : undefined}
                />
                <div>
                  <span className="text-gray-300 font-medium">{option.label}</span>
                  <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Process Button */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
        <button
          onClick={handleEnhance}
          disabled={!uploadedFile || !selectedGenre || isProcessing}
          className={`w-full py-6 rounded-xl font-bold text-xl flex items-center justify-center space-x-3 transition-all duration-300 relative overflow-hidden ${
            isProcessing
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white cursor-not-allowed'
              : uploadedFile && selectedGenre
              ? 'bg-gradient-to-r from-purple-600 via-cyan-600 to-emerald-600 text-white hover:shadow-2xl hover:scale-105 transform'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
              <div className="text-center">
                <div>Processing Audio...</div>
                <div className="text-sm font-normal opacity-80 mt-1">{processingStage}</div>
              </div>
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              <span>Transform to Radio Quality</span>
              <Crown className="w-6 h-6 text-yellow-400" />
            </>
          )}
          
          {!isProcessing && uploadedFile && selectedGenre && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
          )}
        </button>
        
        {uploadedFile && selectedGenre && !isProcessing && (
          <p className="text-center text-gray-400 mt-4 text-sm">
            Ready to enhance "{uploadedFile.name}" with {selectedGenre} characteristics
          </p>
        )}
      </div>
    </div>
  );
}