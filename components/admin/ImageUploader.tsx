'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { Braces, UploadCloud, X } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  currentUrl?: string | null;
  onUrlChange: (url: string | null) => void;
  folderPath: string; // e.g., 'branding'
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, currentUrl, onUrlChange, folderPath }) => {
  const { user } = useUser();
  const storage = useStorage();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(currentUrl || null);
  }, [currentUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `profiles/${user.uid}/${folderPath}/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error("Upload failed:", uploadError);
        setError("Upload failed. Please try again.");
        setIsUploading(false);
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUrlChange(downloadURL);
          setPreviewUrl(downloadURL);
          setIsUploading(false);
          setUploadProgress(null);
        });
      }
    );
  };
  
  const handleRemoveImage = () => {
      onUrlChange(null);
      setPreviewUrl(null);
  }

  const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold block">{label}</label>
      <div className="card p-4 bg-base-200">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-base-100 rounded-lg flex items-center justify-center overflow-hidden border border-base-300 relative group">
            {previewUrl ? (
              <>
                <Image src={previewUrl} alt={label} fill className="object-cover" referrerPolicy="no-referrer" />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <Braces size={24} className="text-base-content/30" />
            )}
          </div>
          <div className="flex-1">
            <label
              htmlFor={inputId}
              className={`cursor-pointer bg-base-100 hover:bg-base-300/50 transition-colors border border-base-300 text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <UploadCloud size={16}/>
              <span>Upload Image</span>
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="mt-2 space-y-1">
                 <progress className="progress progress-primary w-full h-1" value={uploadProgress ?? 0} max="100"></progress>
                 <p className="text-xs text-primary">Uploading... {uploadProgress?.toFixed(0)}%</p>
              </div>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {!isUploading && !error && <p className="text-xs text-base-content/50 mt-2">Max file size: 5MB.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
