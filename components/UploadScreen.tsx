import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface UploadScreenProps {
  onFileSelect: (file: File) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  }, [onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      {/* Logo Area */}
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-surface border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-900/20">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Simulax AI
        </h1>
        <p className="text-secondary text-lg max-w-xl mx-auto leading-relaxed">
          Transform your static PDF Standard Operating Procedures into an interactive, intelligent voice assistant.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full max-w-2xl p-12 rounded-3xl border-2 border-dashed transition-all duration-300
          flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group
          ${isDragging 
            ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(45,212,191,0.15)]' 
            : 'border-slate-700 bg-surface/50 hover:border-slate-600 hover:bg-surface/80'}
        `}
      >
        <input
          type="file"
          accept="application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleInputChange}
        />
        
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Upload className={`w-7 h-7 ${isDragging ? 'text-primary' : 'text-slate-400'}`} />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          Upload SOP Document
        </h3>
        <p className="text-slate-500 text-sm">
          PDF files only (Max 20MB)
        </p>
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-[200%] translate-x-[-50%]" />
      </div>
    </div>
  );
};

export default UploadScreen;