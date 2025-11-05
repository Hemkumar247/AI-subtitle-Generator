import React, { useState, useCallback } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface SrtDisplayProps {
  content: string;
  onReset: () => void;
  onLanguageChange: (language: 'original' | 'english') => void;
  currentLanguage: 'original' | 'english';
}

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


const SrtDisplay: React.FC<SrtDisplayProps> = ({ content, onReset, onLanguageChange, currentLanguage }) => {
  const [copyText, setCopyText] = useState('Copy');

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy'), 2000);
    });
  }, [content]);

  return (
    <div className="w-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
        Subtitles Generated!
      </h2>
      <div className="relative bg-black/30 rounded-lg p-4 h-80 overflow-y-auto border border-white/10">
        <pre className="text-sm text-gray-200 whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col items-center space-y-4">
        <div className="flex w-full p-1 bg-black/30 rounded-lg border border-white/10">
            <ToggleButton
                active={currentLanguage === 'original'}
                onClick={() => onLanguageChange('original')}
                disabled={currentLanguage === 'original'}
            >
                Original Language
            </ToggleButton>
            <ToggleButton
                active={currentLanguage === 'english'}
                onClick={() => onLanguageChange('english')}
                disabled={currentLanguage === 'english'}
            >
                English
            </ToggleButton>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-blue-600/80 rounded-lg shadow-md hover:bg-blue-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <DownloadIcon className="w-5 h-5" />
          Download .srt
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-purple-600/80 rounded-lg shadow-md hover:bg-purple-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <CopyIcon className="w-5 h-5" />
          {copyText}
        </button>
         <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-white/10 rounded-lg shadow-md hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
        >
          <RefreshIcon className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default SrtDisplay;