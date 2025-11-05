import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, file }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };
  
  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);


  return (
    <div className="w-full">
      <label
        htmlFor="audio-upload"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-400 bg-white/10' : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-white/5'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
          {file ? (
            <>
              <p className="mb-2 text-sm text-green-300 font-semibold">{file.name}</p>
              <p className="text-xs text-gray-500">Click or drag to replace the file</p>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold text-gray-200">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">MP3, WAV, M4A, etc. (Max 50MB)</p>
            </>
          )}
        </div>
        <input
          id="audio-upload"
          ref={inputRef}
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </label>
    </div>
  );
};

export default FileUpload;