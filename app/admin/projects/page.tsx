'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Loader, X } from 'lucide-react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { CloudinaryUploader } from '../../../components/admin/CloudinaryUploader';
import { gitprofileConfig } from '../../../gitprofile.config';
import MdxEditor from '../../../components/admin/MdxEditor';

const initialProjectState = {
    name: '',
    description: '',
    longDescription: '',
    techStack: '',
    repoUrl: '',
    liveUrl: '',
    screenshots: [] as string[],
};

const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
const textareaClass = `${inputClass} min-h-[100px]`;

export default function ManageProjectsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newProject, setNewProject] = useState(initialProjectState);
  const [isAdding, setIsAdding] = useState(false);
  const profileId = gitprofileConfig.github.username;

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `profiles/${profileId}/projects`);
  }, [firestore, profileId]);

  const { data: projects, isLoading } = useCollection(projectsQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleMarkdownChange = (value: string) => {
    setNewProject(prev => ({...prev, longDescription: value}));
  }
  
  const handleScreenshotUpload = (url: string | null) => {
    if (url) {
        setNewProject(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, url]
        }));
    }
  };

  const handleRemoveScreenshot = (indexToRemove: number) => {
    setNewProject(prev => ({
        ...prev,
        screenshots: prev.screenshots.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description || !projectsQuery || !user) return;

    setIsAdding(true);
    const projectData = {
      ...newProject,
      techStack: newProject.techStack.split(',').map(s => s.trim()).filter(Boolean),
      screenshots: newProject.screenshots,
      profileId: profileId,
      ownerId: user.uid,
    };
    
    try {
      await addDocumentNonBlocking(projectsQuery, projectData);
    } finally {
      setNewProject(initialProjectState);
      setIsAdding(false);
    }
  };

  const handleDeleteProject = (projId: string) => {
    if (!firestore) return;
    const projRef = doc(firestore, `profiles/${profileId}/projects/${projId}`);
    deleteDocumentNonBlocking(projRef);
  };

  const { cloudName, uploadPreset } = gitprofileConfig.cloudinary;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
      </div>

      <div className="card p-6 mb-6">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={newProject.name} onChange={handleInputChange} placeholder="Project Name" className={inputClass} required />
            <input type="text" name="repoUrl" value={newProject.repoUrl} onChange={handleInputChange} placeholder="Repository URL" className={inputClass} />
            <input type="text" name="liveUrl" value={newProject.liveUrl} onChange={handleInputChange} placeholder="Live URL" className={inputClass} />
          </div>
          <textarea name="description" value={newProject.description} onChange={handleInputChange} placeholder="Short Description" className={textareaClass} required />
          
          <div>
            <label className="text-sm font-bold block mb-2">Long Description</label>
            <MdxEditor markdown={newProject.longDescription} onChange={handleMarkdownChange} placeholder="Full project details (for detail page)..." />
          </div>
          
          <textarea name="techStack" value={newProject.techStack} onChange={handleInputChange} placeholder="Tech Stack (comma-separated, e.g., React, Next.js)" className={textareaClass} />
          
          <div>
            <CloudinaryUploader
                label="Project Screenshots"
                onUrlChange={handleScreenshotUpload}
                cloudName={cloudName}
                uploadPreset={uploadPreset}
                multiple
            />
            {newProject.screenshots.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-bold mb-2">Uploaded Screenshots:</p>
                    <div className="flex flex-wrap gap-4">
                        {newProject.screenshots.map((url, index) => (
                            <div key={index} className="relative group w-24 h-24">
                                <Image
                                    src={url}
                                    alt={`Screenshot ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg border border-base-300"
                                    referrerPolicy="no-referrer"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveScreenshot(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isAdding}>
            {isAdding ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
            <span>{isAdding ? 'Adding...' : 'Add Project'}</span>
          </button>
        </form>
      </div>

      <div className="card p-6">
        {isLoading && (
           <div className="flex justify-center items-center">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
        {!isLoading && (!projects || projects.length === 0) && (
          <p className="text-base-content/60">No projects found. Add one to get started.</p>
        )}
        {!isLoading && projects && projects.length > 0 && (
           <div className="space-y-4">
            {projects.map(proj => (
              <div key={proj.id} className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{proj.name}</h3>
                  <p className="text-sm text-base-content/60 line-clamp-1">{proj.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteProject(proj.id)} className="btn btn-sm btn-error">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
