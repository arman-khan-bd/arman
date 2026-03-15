'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface CloudinaryUploaderProps {
  label: string;
  currentUrl?: string | null;
  onUrlChange: (url: string | null) => void;
  cloudName: string;
  uploadPreset: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ label, currentUrl, onUrlChange, cloudName, uploadPreset }) => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    setIsUploading(true);
    setError(null);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "post",
      body: data
    })
    .then(resp => resp.json())
    .then(data => {
      if (data.url) {
        onUrlChange(data.url);
      } else {
        setError('Upload failed. Please check console for details.');
        console.error("Cloudinary upload error:", data);
      }
      setIsUploading(false);
      setImage(null);
    })
    .catch(err => {
      console.error(err);
      setError('An error occurred during upload.');
      setIsUploading(false);
      setImage(null);
    });
  };
  
  const handleRemoveImage = () => {
    onUrlChange(null);
  };

  const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold block">{label}</label>
      <div className="card p-4 bg-base-200">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-base-100 rounded-lg flex items-center justify-center overflow-hidden border border-base-300 relative group">
            {currentUrl ? (
              <>
                <Image src={currentUrl} alt={label} fill className="object-cover" referrerPolicy="no-referrer" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </>
            ) : isUploading ? (
               <Loader2 size={24} className="text-primary animate-spin" />
            ) : (
              <UploadCloud size={24} className="text-base-content/30" />
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor={inputId}
              className={`cursor-pointer bg-base-100 hover:bg-base-300/50 transition-colors border border-base-300 text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <UploadCloud size={16}/>
              <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {!isUploading && !error && <p className="text-xs text-base-content/50 mt-2">Select an image to upload.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
