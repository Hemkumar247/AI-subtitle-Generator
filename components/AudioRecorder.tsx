import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopIcon } from './icons/StopIcon';
import { TrashIcon } from './icons/TrashIcon';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  audioFile: File | null;
  onClearRecording: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, audioFile, onClearRecording }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<number | null>(null);

    const cleanupRecorderState = useCallback(() => {
        setIsRecording(false);
        setRecordingTime(0);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
    }, []);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
            cleanupRecorderState();
        };
    }, [audioURL, cleanupRecorderState]);

    const handleReset = () => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
            setAudioURL(null);
        }
        onClearRecording();
    };

    const startRecording = useCallback(async () => {
        handleReset(); // Clear previous recording if any
        setError(null);

        if (!navigator.mediaDevices?.getUserMedia) {
            setError("Your browser does not support audio recording.");
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const newAudioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                onRecordingComplete(newAudioFile);
                cleanupRecorderState();
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            timerIntervalRef.current = window.setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Microphone access was denied. Please allow microphone access in your browser settings.");
            cleanupRecorderState();
        }
    }, [onRecordingComplete, cleanupRecorderState]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
        }
    }, []);
    
    const handleRecordClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (audioFile && audioURL) {
        return (
            <div className="w-full flex flex-col items-center justify-center space-y-5 h-64 text-center">
                <p className="text-gray-300">Recording complete. Ready to generate.</p>
                <audio controls src={audioURL} className="w-full max-w-md rounded-full"></audio>
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-5 py-2 font-semibold text-white bg-white/10 rounded-lg shadow-md hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                        aria-label="Record a new audio file"
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                        Record Again
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-5 py-2 font-semibold text-white bg-red-600/80 rounded-lg shadow-md hover:bg-red-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        aria-label="Discard this recording"
                    >
                        <TrashIcon className="w-5 h-5" />
                        Discard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center space-y-4 h-64">
            <button
                onClick={handleRecordClick}
                className={`relative flex items-center justify-center w-28 h-28 rounded-full transition-all duration-300 ${
                    isRecording 
                        ? 'bg-red-500/80 hover:bg-red-600/80 shadow-[0_0_20px_theme(colors.red.500)]'
                        : 'bg-indigo-600/80 hover:bg-indigo-700/80 shadow-[0_0_20px_theme(colors.indigo.500)]'
                } text-white focus:outline-none transform hover:scale-105`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isRecording && <span className="absolute inset-0 rounded-full bg-red-500 animate-pulse"></span>}
                <div className="relative z-10">
                    {isRecording ? <StopIcon className="w-10 h-10" /> : <MicrophoneIcon className="w-12 h-12" />}
                </div>
            </button>
            <div className="h-6 text-center">
                {isRecording ? (
                    <p className="text-lg text-gray-300 font-mono tracking-wider">{formatTime(recordingTime)}</p>
                ) : (
                    <p className="text-gray-400">Click the button to start recording</p>
                )}
            </div>

            {error && <p className="text-pink-400 text-sm text-center mt-2">{error}</p>}
        </div>
    );
};

export default AudioRecorder;
