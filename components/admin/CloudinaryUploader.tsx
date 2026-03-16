'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Loader2, FileText } from 'lucide-react';

interface CloudinaryUploaderProps {
  label: string;
  currentUrl?: string | null;
  onUrlChange: (url: string | null) => void;
  cloudName: string;
  uploadPreset: string;
  accept?: string;
  multiple?: boolean;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ label, currentUrl, onUrlChange, cloudName, uploadPreset, accept = "image/*,.svg", multiple = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloudName);

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "post",
        body: data
      })
      .then(resp => resp.json())
      .then(data => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          console.error("Cloudinary upload error:", data);
          reject(new Error('Upload failed. Response did not contain a secure_url.'));
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const uploadPromises = Array.from(files).map(file => uploadFile(file));

    try {
      const urls = await Promise.all(uploadPromises);
      urls.forEach(url => onUrlChange(url));
    } catch (err) {
      setError('An error occurred during upload. Check console for details.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemoveImage = () => {
    onUrlChange(null);
  };

  const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;
  
  const isPdf = accept === 'application/pdf';

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold block">{label}</label>
      <div className="card p-4 bg-base-200">
        <div className="flex items-center gap-4">
          {/* For single file uploader, show preview */}
          {!multiple && (
            <div className="w-20 h-20 bg-base-100 rounded-lg flex items-center justify-center overflow-hidden border border-base-300 relative group">
              {currentUrl ? (
                <>
                  {isPdf ? (
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-primary">
                      <FileText size={24} />
                      <span className="text-xs mt-1">View PDF</span>
                    </a>
                  ) : (
                    <Image src={currentUrl} alt={label} fill className="object-cover" referrerPolicy="no-referrer" />
                  )}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove file"
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
          )}

          <div className="flex-1">
            <label
              htmlFor={inputId}
              className={`cursor-pointer bg-base-100 hover:bg-base-300/50 transition-colors border border-base-300 text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16}/>}
              <span>{isUploading ? 'Uploading...' : `Upload ${multiple ? 'File(s)' : (isPdf ? 'PDF' : 'Image')}`}</span>
            </label>
            <input
              id={inputId}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
              multiple={multiple}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {!isUploading && !error && <p className="text-xs text-base-content/50 mt-2">Select {multiple ? 'one or more files' : 'a file'} to upload.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
