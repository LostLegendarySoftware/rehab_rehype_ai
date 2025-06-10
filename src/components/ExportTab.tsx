import React, { useState } from 'react';
import { Download, FileAudio, Settings, Check } from 'lucide-react';

export default function ExportTab() {
  const [exportFormat, setExportFormat] = useState('wav');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Export Format */}
      <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FileAudio className="w-5 h-5 mr-2 text-cyan-400" />
          Export Format
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'wav', name: 'WAV', desc: 'Uncompressed, highest quality' },
            { id: 'flac', name: 'FLAC', desc: 'Lossless compression' },
            { id: 'mp3', name: 'MP3', desc: 'Compressed, smaller file size' }
          ].map((format) => (
            <button
              key={format.id}
              onClick={() => setExportFormat(format.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                exportFormat === format.id
                  ? 'border-purple-500 bg-purple-600/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-medium text-white mb-1">{format.name}</div>
              <div className="text-sm text-gray-400">{format.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quality Settings */}
      <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-emerald-400" />
          Quality Settings
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sample Rate
            </label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option>44.1 kHz (CD Quality)</option>
              <option>48 kHz (Professional)</option>
              <option>96 kHz (High-Res)</option>
              <option>192 kHz (Ultra High-Res)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bit Depth
            </label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option>16-bit (Standard)</option>
              <option>24-bit (Professional)</option>
              <option>32-bit Float (Maximum)</option>
            </select>
          </div>
        </div>
        
        {exportFormat === 'mp3' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MP3 Quality
            </label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option>320 kbps (Highest)</option>
              <option>256 kbps (High)</option>
              <option>192 kbps (Standard)</option>
              <option>128 kbps (Compact)</option>
            </select>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">Metadata</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Track Title</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter track title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter artist name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Album</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter album name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
            <input
              type="text"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="Enter genre"
            />
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-lg font-semibold text-white mb-4">Export Options</h4>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-600 bg-gray-700" defaultChecked />
            <span className="text-gray-300">Include mastering chain</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
            <span className="text-gray-300">Export individual tracks</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
            <span className="text-gray-300">Create stems package</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded border-gray-600 bg-gray-700" defaultChecked />
            <span className="text-gray-300">Radio-ready loudness</span>
          </label>
        </div>
      </div>

      {/* Export Button */}
      <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/50">
        {exportComplete ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Export Complete!</h4>
            <p className="text-gray-400 mb-4">Your high-quality audio file is ready for download</p>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto">
              <Download className="w-5 h-5" />
              <span>Download File</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all ${
              isExporting
                ? 'bg-yellow-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700'
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Export High-Quality Audio</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}