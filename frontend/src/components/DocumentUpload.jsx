import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { uploadDocument } from '../api/client';
import LoadingSpinner from './LoadingSpinner';

export default function DocumentUpload({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const processFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    setError(null);
    setIsUploading(true);
    try {
      await uploadDocument(file);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <LoadingSpinner size="lg" text="Uploading document..." />
          ) : (
            <>
              <div className="p-4 bg-slate-900 rounded-full text-blue-500">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-slate-200 font-medium text-lg">
                  Drag & drop your PDF here
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  or click to browse from your computer
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}
    </div>
  );
}
