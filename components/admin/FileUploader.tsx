'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useStorage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { File as FileIcon, UploadCloud, X, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  currentUrl?: string | null;
  onUrlChange: (url: string | null) => void;
  folderPath: string; // e.g., 'resumes'
  accept: string; // e.g., 'application/pdf'
}

export const FileUploader: React.FC<FileUploaderProps> = ({ label, currentUrl, onUrlChange, folderPath, accept }) => {
  const { user } = useUser();
  const storage = useStorage();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    setFileUrl(currentUrl || null);
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
          setFileUrl(downloadURL);
          setIsUploading(false);
          setUploadProgress(null);
        });
      }
    );
  };
  
  const handleRemoveFile = () => {
      onUrlChange(null);
      setFileUrl(null);
  }

  const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold block">{label}</label>
      <div className="card p-4 bg-base-200">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-base-100 rounded-lg flex items-center justify-center border border-base-300 relative group">
            {fileUrl ? (
              <div className="flex flex-col items-center gap-1 text-green-500">
                <CheckCircle size={32} />
                <span className="text-xs font-bold">Uploaded</span>
              </div>
            ) : (
              <FileIcon size={24} className="text-base-content/30" />
            )}
          </div>
          <div className="flex-1">
             {fileUrl ? (
                <div className="flex items-center gap-2">
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate max-w-xs">
                        View Uploaded File
                    </a>
                    <button
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                    >
                        <X size={16} />
                    </button>
                </div>
             ) : (
                <label
                    htmlFor={inputId}
                    className={`cursor-pointer bg-base-100 hover:bg-base-300/50 transition-colors border border-base-300 text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <UploadCloud size={16}/>
                    <span>Upload File</span>
                </label>
             )}
            <input
              id={inputId}
              type="file"
              accept={accept}
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
