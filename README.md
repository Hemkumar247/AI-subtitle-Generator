<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,9,18&height=200&section=header&text=AI%20Subtitle%20Generator&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Speech-to-Text%20%2B%20Multilingual%20Translation%20%7C%20Whisper%20%2B%20Gemini%20AI&descAlignY=58&descSize=15"/>

<br/>

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Whisper](https://img.shields.io/badge/OpenAI_Whisper-412991?style=for-the-badge&logo=openai&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)

<br/>

> **Upload any audio or video. Get accurate, timestamped subtitles in multiple languages — instantly.**
> No manual transcription. No expensive tools. Just AI.

<br/>

[![GitHub stars](https://img.shields.io/github/stars/Hemkumar247/AI-subtitle-Generator?style=social)](https://github.com/Hemkumar247/AI-subtitle-Generator)

</div>

---

## 💡 The Origin Story

> *I was watching a Korean movie late one night — and I couldn't find English subtitles anywhere.*

That moment made me realize how often language is the only barrier between a person and a story they'd love. Subtitles exist to bridge that gap — but creating them is slow, expensive, and inaccessible for most creators and enthusiasts.

So I built **AI Subtitle Generator** — an AI-powered tool that generates accurate, timestamped subtitles from any audio or video file, automatically, in multiple languages.

This is a problem I personally faced. The solution is one I'd actually use.

---

## ✨ Features

```
🎙️ Record Audio Live        →  Record directly in the browser — no file needed
📁 Upload MP3 / MP4         →  Supports both audio and video file input
⏱️ Timestamp Alignment      →  Subtitles precisely synced with the source audio
🌐 Native Language Output   →  Subtitles in the original spoken language
🇬🇧 English Translation     →  Parallel English subtitles via Gemini AI
🌍 Multi-Language Support   →  Regional + international languages supported
🎤 Speaker Detection        →  Identifies and labels different speakers
📄 SRT / VTT Export         →  Ready-to-use subtitle file formats
📋 Copy to Clipboard        →  One-click copy for quick use
⬇️ Download Output          →  Download translated text directly
```

---

## 🎬 How It Works

```
User records live OR uploads MP3 / MP4 file
                ↓
      FFmpeg preprocesses the audio
      (extraction + format conversion)
                ↓
      OpenAI Whisper transcribes speech
      → raw text with precise timestamps
      → automatic punctuation
                ↓
      Gemini AI handles:
      → Translation to English
      → Native language subtitle formatting
      → Speaker label identification
                ↓
      Subtitles rendered in frontend
      with timestamp alignment
                ↓
      Export as SRT / VTT
      OR copy directly to clipboard
```

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Speech-to-Text** | OpenAI Whisper | Transcribes audio with timestamps |
| **Translation & NLP** | Google Gemini AI | Translates + formats subtitles |
| **Audio Processing** | FFmpeg | Format handling + audio extraction |
| **Frontend** | HTML / CSS / JavaScript | Direct browser interface |
| **Backend** | Python | Orchestrates the full pipeline |

---

## 🌐 Supported Languages

Whisper + Gemini together handle a wide range of languages including:

`English` `Tamil` `Hindi` `Korean` `Telugu` `Malayalam` `Kannada` `Bengali` `French` `Spanish` `German` `Japanese` `Arabic` and many more.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- FFmpeg installed on your system
- Google Gemini API key

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Hemkumar247/AI-subtitle-Generator.git
cd AI-subtitle-Generator

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Install FFmpeg
# macOS:
brew install ffmpeg
# Ubuntu/Debian:
sudo apt install ffmpeg
# Windows: download from https://ffmpeg.org/download.html

# 4. Add your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 5. Run the app
python app.py
```

Open the app in your browser and generate your first subtitles 🎬

---

## 🎯 Who Is This For

| User | Use Case |
|---|---|
| 🎬 Movie enthusiasts | Generate subtitles for foreign films with no existing subs |
| 🎓 Educators | Auto-subtitle lectures and educational content |
| 🎙️ Content creators | Add subtitles to videos without manual effort |
| 🌍 Language learners | Read native + English subtitles side by side |
| 🏢 Professionals | Transcribe meetings, interviews, and presentations |

---

## 🔮 Coming Soon

- [ ] Live deployment (Vercel / Render)
- [ ] YouTube URL direct input
- [ ] Subtitle overlay on video preview
- [ ] Batch processing for multiple files
- [ ] Downloadable `.srt` and `.vtt` with embedded timestamps
- [ ] Dark/light UI theme toggle

---

## 🤝 Contributing

Pull requests and ideas are welcome.
Open an [issue](https://github.com/Hemkumar247/AI-subtitle-Generator/issues) to report bugs or suggest features.

---

## 🧑‍💻 Built by

**Hem Kumar** — AI + Full-Stack Developer, Chennai 🇮🇳

*Started from a late-night Korean movie. Built into a tool for the world.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-hemkumarvitta-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hemkumarvitta)
[![GitHub](https://img.shields.io/badge/GitHub-Hemkumar247-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Hemkumar247)
[![Gmail](https://img.shields.io/badge/Email-hemkumarvitta%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:hemkumarvitta@gmail.com)

---

<div align="center">

⭐ **If this helped you enjoy content across language barriers — drop a star.**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,9,18&height=100&section=footer"/>

</div>
