import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Music, Mic, Volume2, Sparkles, Crown, Zap, Heart } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: 'lyrics' | 'composition' | 'mixing' | 'creative';
}

const aiCapabilities = [
  { icon: Music, label: 'Song Composition', color: 'text-purple-400', desc: 'Create melodies, chord progressions, and arrangements' },
  { icon: Mic, label: 'Lyric Writing', color: 'text-cyan-400', desc: 'Craft compelling lyrics and vocal melodies' },
  { icon: Volume2, label: 'Mixing Guidance', color: 'text-emerald-400', desc: 'Professional mixing and mastering advice' },
  { icon: Sparkles, label: 'Creative Direction', color: 'text-yellow-400', desc: 'Artistic vision and style development' },
  { icon: Heart, label: 'Emotional Resonance', color: 'text-pink-400', desc: 'Connect with your audience through music' },
  { icon: Crown, label: 'Industry Standards', color: 'text-orange-400', desc: 'Commercial viability and market trends' }
];

const quickPrompts = [
  { text: 'Help me write a hook for my rap song', category: 'lyrics' },
  { text: 'What chord progression works for emotional ballads?', category: 'composition' },
  { text: 'How do I make my vocals sit better in the mix?', category: 'mixing' },
  { text: 'I need creative ideas for my bridge section', category: 'creative' },
  { text: 'How can I make my song more radio-friendly?', category: 'creative' },
  { text: 'What are current trends in trap production?', category: 'composition' }
];

export default function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "🎵 Welcome to your AI Music Production Assistant! I'm here to help transform your musical vision into reality. Whether you need help with songwriting, composition, mixing, or creative direction, I've got the expertise of top producers and songwriters at your fingertips. What musical challenge can we tackle together today?",
      timestamp: new Date(),
      category: 'creative'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with more sophisticated responses
    setTimeout(() => {
      const responses = [
        "That's a fantastic direction! Let me break this down for you with some professional insights...",
        "I love where you're going with this! Here's how we can take it to the next level...",
        "Great question! Based on current industry standards and what's working in the charts...",
        "This is exactly the kind of creative challenge I excel at! Let's explore some options...",
        "Perfect timing for this question! I've been analyzing the latest trends and here's what I recommend..."
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        category: 'creative'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="p-6 h-full flex flex-col max-w-7xl mx-auto">
      {/* AI Capabilities Header */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 mb-6 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <span>AI Music Production Assistant</span>
            <Crown className="w-6 h-6 text-yellow-400" />
          </h2>
          <p className="text-gray-400">Your personal music production expert powered by advanced AI</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {aiCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div key={index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 group">
                <div className="text-center">
                  <Icon className={`w-6 h-6 ${capability.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <h4 className="text-sm font-semibold text-white mb-1">{capability.label}</h4>
                  <p className="text-xs text-gray-400">{capability.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 overflow-y-auto mb-6 shadow-2xl">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                    : 'bg-gray-700/50 text-gray-200 border border-gray-600/50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {message.type === 'ai' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-cyan-400">AI Assistant</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold">You</span>
                    </div>
                  )}
                  <span className="text-xs opacity-75">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700/50 border border-gray-600/50 px-6 py-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about lyrics, composition, mixing, creative direction, or anything music-related..."
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        {/* Quick Prompts */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Quick Start Prompts</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.text)}
                className="px-4 py-2 text-sm bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
              >
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}