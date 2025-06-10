# 🎵 Rehab re-hype AI
### Digital Recovery & Restoration Suite

> Transform your lo-fi recordings into radio-ready masterpieces with AI-powered audio enhancement

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

## 🚀 What is Rehab re-hype AI?

**Rehab re-hype AI** is a revolutionary web-based audio production suite that transforms low-quality recordings into professional, radio-ready tracks. Whether you have old demos, rough recordings, or unfinished songs, our AI-powered platform helps you achieve the sound quality of top artists across multiple genres.

### ✨ Key Features

- **🎯 AI Audio Enhancement** - Transform lo-fi recordings to broadcast quality
- **🎨 Genre-Specific Processing** - Match the sound of top artists in 12+ genres
- **🤖 AI Music Assistant** - Chat with our music-trained AI for creative guidance
- **🎙️ Professional Recording Studio** - High-quality recording with real-time monitoring
- **✂️ Advanced Track Separation** - Isolate vocals, instruments, drums, and bass
- **🎛️ Professional Mastering** - Industry-standard mastering with reference matching
- **📤 Multi-Format Export** - Export in various professional formats
- **👥 Team Collaboration** - Real-time collaboration with project sharing
- **📊 Analytics Dashboard** - Track your production progress and statistics

## 🎵 Supported Genres & Artist Styles

Transform your music to match the sound of:

| Genre | Artist Styles | Characteristics |
|-------|---------------|-----------------|
| **Rock** | Classic & Modern Rock | Powerful guitars, dynamic drums |
| **Rap/Hip-Hop** | Commercial Rap | Punchy beats, clear vocals |
| **Pop** | Radio-Ready Pop | Polished, mainstream appeal |
| **Punk** | Raw Energy | Aggressive, fast-paced |
| **Heavy Metal** | Metal Masters | Heavy distortion, powerful low-end |
| **Emo Rap** | Emotional Hip-Hop | Melodic, atmospheric |
| **Emo Punk** | Emotional Punk | Raw emotion, alternative sound |
| **Gothic Rap** | Dark Hip-Hop | Atmospheric, moody |
| **Trap** | Modern Trap | 808s, hi-hats, modern production |
| **Benny Blanco Style** | Pop Production | Clean, radio-friendly |
| **Ed Sheeran Style** | Acoustic Pop | Warm, intimate, acoustic-focused |
| **Acoustic** | Pure Acoustic | Natural, organic sound |

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Framer Motion 10.16.16** - Smooth animations
- **Zustand 4.4.7** - State management

### Audio Processing
- **Web Audio API** - Browser-native audio processing
- **Tone.js 14.7.77** - Advanced audio synthesis
- **WaveSurfer.js 7.7.3** - Audio visualization
- **Custom AI Models** - Genre-specific enhancement

### Development Tools
- **Vite 5.4.2** - Fast build tool
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **PWA Support** - Progressive Web App capabilities

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- Modern web browser with Web Audio API support

### Quick Start

```bash
# Clone the repository
git clone https://github.com/LostLegendarySoftware/rehab_rehype_ai.git

# Navigate to project directory
cd rehab_rehype_ai

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser to http://localhost:5173
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🎯 Usage Guide

### 1. **Audio Enhancement**
1. Upload your audio file (MP3, WAV, FLAC, etc.)
2. Select target genre and enhancement level
3. Configure Dolby processing options
4. Click "Transform to Radio Quality"
5. Download your enhanced track

### 2. **AI Music Assistant**
- Chat with our AI for creative guidance
- Get help with lyrics, composition, and mixing
- Ask about industry trends and techniques
- Receive personalized recommendations

### 3. **Professional Recording**
- Use our studio-grade recording interface
- Real-time monitoring and input level control
- Multiple quality presets (Broadcast, Professional, Mastering)
- AI song completion for unfinished tracks

### 4. **Track Separation**
- Upload mixed audio files
- AI separates vocals, instruments, drums, bass
- Individual track control and enhancement
- Export separated stems

### 5. **Professional Mastering**
- Industry-standard mastering chain
- Reference track matching
- Real-time loudness analysis
- Multiple mastering presets

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_ENDPOINT=https://api.rehabrehype.com
VITE_AI_MODEL_URL=https://models.rehabrehype.com
VITE_CLOUD_STORAGE_URL=https://storage.rehabrehype.com
```

### Audio Processing Settings

The application automatically detects browser capabilities and adjusts processing accordingly:

- **Sample Rates**: 44.1kHz, 48kHz, 96kHz, 192kHz
- **Bit Depths**: 16-bit, 24-bit, 32-bit Float
- **Formats**: WAV, MP3, FLAC, AIFF, DSD

## 📱 Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |

**Note**: Web Audio API and modern JavaScript features required.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits & Acknowledgments

### Core Team
- **LostLegendarySoftware** - Lead Development & Architecture

### Technologies & Libraries
- **React Team** - UI Framework
- **Vite Team** - Build Tool
- **Tone.js Contributors** - Audio Processing
- **Tailwind CSS Team** - Styling Framework

### Audio Processing
- Web Audio API specifications
- Modern audio enhancement algorithms
- Industry-standard mastering techniques

### Special Thanks
- Music producers and engineers who inspired our algorithms
- Beta testers and early adopters
- Open source community contributors

## 📞 Support & Contact

- **Documentation**: [docs.rehabrehype.com](https://docs.rehabrehype.com)
- **Issues**: [GitHub Issues](https://github.com/LostLegendarySoftware/rehab_rehype_ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/LostLegendarySoftware/rehab_rehype_ai/discussions)
- **Email**: support@rehabrehype.com

## 🗺️ Roadmap

### Version 2.0 (Coming Soon)
- [ ] Real-time collaboration features
- [ ] Advanced AI model training
- [ ] Mobile app development
- [ ] VST plugin version
- [ ] API for third-party integrations

### Version 2.1
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Custom AI model training
- [ ] Enterprise features

---

<div align="center">

**Made with ❤️ by LostLegendarySoftware**

*Transform your music. Realize your potential.*

[🌟 Star this repo](https://github.com/LostLegendarySoftware/rehab_rehype_ai) | [🐛 Report Bug](https://github.com/LostLegendarySoftware/rehab_rehype_ai/issues) | [💡 Request Feature](https://github.com/LostLegendarySoftware/rehab_rehype_ai/issues)

</div>