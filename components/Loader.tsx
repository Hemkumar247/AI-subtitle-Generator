import React, { useState, useEffect } from 'react';

interface LoaderProps {
    audioDuration?: number;
}

const Loader: React.FC<LoaderProps> = ({ audioDuration = 0 }) => {
    const [message, setMessage] = useState('Warming up the AI...');
    
    useEffect(() => {
      const messages = [
        'Analyzing soundwaves...',
        'Identifying speech patterns...',
        'Transcribing the dialogue...',
        'Synchronizing timestamps...',
        'Formatting subtitles...',
        'Just a few more seconds...',
      ];
      let messageIndex = 0;
      
      const interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setMessage(messages[messageIndex]);
      }, 2500);

      return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-16 h-16 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-300 font-semibold tracking-wider text-center">
        {message}
      </p>
      {audioDuration > 60 && (
         <p className="text-sm text-gray-500">This may take a moment for longer audio.</p>
      )}
    </div>
  );
};

export default Loader;