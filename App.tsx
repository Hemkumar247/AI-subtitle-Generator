import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateSrtFromAudio } from './services/geminiService';
import { fileToBase64, getAudioDuration } from './utils/fileUtils';
import FileUpload from './components/FileUpload';
import SrtDisplay from './components/SrtDisplay';
import Loader from './components/Loader';
import AudioRecorder from './components/AudioRecorder';

const App: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [srtContent, setSrtContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<'original' | 'english'>('original');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        container.style.setProperty('--mouse-x', `${x}px`);
        container.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAudioFileChange = async (file: File | null) => {
    if (file) {
      setAudioFile(file);
      setSrtContent('');
      setError('');
      setTargetLanguage('original');
      try {
        const duration = await getAudioDuration(file);
        setAudioDuration(duration);
      } catch (err) {
        console.error("Failed to get audio duration:", err);
        setAudioDuration(0);
      }
    }
  };

  const handleResetRecording = () => {
    setAudioFile(null);
    setError('');
    setTargetLanguage('original');
    setAudioDuration(0);
  };
  
  const processAudio = async (language: 'original' | 'english') => {
    if (!audioFile) {
      setError('An audio file is required to generate subtitles.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSrtContent('');
    
    try {
      const base64Audio = await fileToBase64(audioFile);
      const mimeType = audioFile.type;
      
      const result = await generateSrtFromAudio(base64Audio, mimeType, language);
      setSrtContent(result);
      setTargetLanguage(language); // Set language on successful generation
    } catch (err) {
      console.error(err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        if (message.includes('unsupported content') || message.includes('invalid argument')) {
          errorMessage = 'The audio format is not supported. Please use a common format like WAV, MP3, or WEBM.';
        } else if (message.includes('too long') || message.includes('payload size')) {
          errorMessage = 'The audio file is too large or too long. Please use a smaller file.';
        } else if (message.includes('did not return a valid srt format')) {
          errorMessage = 'The AI could not process the audio. It might be silent, contain unsupported content, or be too complex.';
        } else if (message.includes('safety concerns')) {
           errorMessage = 'Could not generate subtitles as the audio content was flagged for safety reasons.';
        } else if (message.includes('gemini api error')) {
            errorMessage = 'There was a problem with the AI service. Please try again later.';
        }
      }
      // If we failed, revert the language to what it was before this attempt.
      // This is especially important if the srtContent is not empty (i.e., we were trying to switch languages)
      if (srtContent) {
        setTargetLanguage(targetLanguage);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateClick = useCallback(async () => {
     await processAudio(targetLanguage);
  }, [audioFile, targetLanguage]);
  
  const handleLanguageChange = useCallback(async (newLanguage: 'original' | 'english') => {
    if (newLanguage === targetLanguage) return; // No change needed
    setTargetLanguage(newLanguage);
    await processAudio(newLanguage);
  }, [audioFile, targetLanguage]);

  const handleReset = () => {
    setAudioFile(null);
    setSrtContent('');
    setError('');
    setIsLoading(false);
    setMode('upload');
    setTargetLanguage('original');
    setAudioDuration(0);
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 text-md font-medium transition-colors duration-300 focus:outline-none ${
        active
          ? 'text-white'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
      {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-indigo-400 rounded-full"></span>}
    </button>
  );

  const ToggleButton: React.FC<{ active: boolean; onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ active, onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-1/2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none disabled:cursor-not-allowed ${
        active
          ? 'bg-indigo-600 text-white shadow'
          : 'text-gray-400 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );

  const resetStateForModeChange = () => {
    setAudioFile(null);
    setError('');
    setTargetLanguage('original');
    setAudioDuration(0);
  }

  return (
    <div ref={containerRef} className="interactive-bg min-h-screen text-gray-100 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <style>{`
        .interactive-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(128, 0, 255, 0.15), transparent 80%);
          transition: background-position 0.1s ease;
          z-index: 0;
        }
      `}</style>
      <div className="w-full max-w-3xl mx-auto z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500">
            AI Subtitle Generator
          </h1>
          <p className="mt-2 text-gray-400">
            From file or live recording, get perfectly timed SRT subtitles.
          </p>
        </header>

        <main className="bg-black/20 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
          {isLoading ? (
             <div className="p-6 sm:p-8"><Loader audioDuration={audioDuration} /></div>
          ) : srtContent ? (
             <div className="p-6 sm:p-8">
                <SrtDisplay 
                    content={srtContent} 
                    onReset={handleReset} 
                    onLanguageChange={handleLanguageChange}
                    currentLanguage={targetLanguage}
                />
            </div>
          ) : (
            <>
              <div className="flex border-b border-white/10 px-6">
                <TabButton active={mode === 'upload'} onClick={() => { resetStateForModeChange(); setMode('upload'); }}>
                  Upload File
                </TabButton>
                <TabButton active={mode === 'record'} onClick={() => { resetStateForModeChange(); setMode('record'); }}>
                  Record Audio
                </TabButton>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center space-y-6">
                  {mode === 'upload' ? (
                    <FileUpload onFileChange={handleAudioFileChange} file={audioFile} />
                  ) : (
                    <AudioRecorder
                      onRecordingComplete={handleAudioFileChange}
                      audioFile={audioFile}
                      onClearRecording={handleResetRecording}
                    />
                  )}
                  {error && <p className="text-pink-400 text-center">{error}</p>}
                  
                  {audioFile && (
                    <div className="w-full max-w-sm flex flex-col items-center space-y-3">
                      <p className="text-gray-300 font-medium">Select Subtitle Language:</p>
                      <div className="flex w-full p-1 bg-black/30 rounded-lg border border-white/10">
                        <ToggleButton
                          active={targetLanguage === 'original'}
                          onClick={() => setTargetLanguage('original')}
                        >
                          Original Language
                        </ToggleButton>
                        <ToggleButton
                          active={targetLanguage === 'english'}
                          onClick={() => setTargetLanguage('english')}
                        >
                          English
                        </ToggleButton>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateClick}
                    disabled={!audioFile || isLoading}
                    className="w-full sm:w-auto px-10 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                  >
                    Generate Subtitles
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;