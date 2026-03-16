'use client';

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Loader, X, Edit, Save } from 'lucide-react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { CloudinaryUploader } from '../../../components/admin/CloudinaryUploader';
import { gitprofileConfig } from '../../../gitprofile.config';
import MdxEditor from '../../../components/admin/MdxEditor';

// Type for Firestore document
interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  techStack: string[];
  repoUrl: string;
  liveUrl: string;
  screenshots: string[];
  profileId: string;
  ownerId: string;
}

// Type for the form state
type ProjectFormState = {
    name: string;
    description: string;
    longDescription: string;
    techStack: string; // Comma-separated string
    repoUrl: string;
    liveUrl: string;
    screenshots: string[];
};

const initialProjectState: ProjectFormState = {
    name: '',
    description: '',
    longDescription: '',
    techStack: '',
    repoUrl: '',
    liveUrl: '',
    screenshots: [],
};

const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
const textareaClass = `${inputClass} min-h-[100px]`;

export default function ManageProjectsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [formState, setFormState] = useState<ProjectFormState>(initialProjectState);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const profileId = gitprofileConfig.github.username;
  const formRef = useRef<HTMLDivElement>(null);

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `profiles/${profileId}/projects`);
  }, [firestore, profileId]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleMarkdownChange = (value: string) => {
    setFormState(prev => ({...prev, longDescription: value}));
  }
  
  const handleScreenshotUpload = (url: string | null) => {
    if (url) {
        setFormState(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, url]
        }));
    }
  };

  const handleRemoveScreenshot = (indexToRemove: number) => {
    setFormState(prev => ({
        ...prev,
        screenshots: prev.screenshots.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setFormState({
        name: project.name || '',
        description: project.description || '',
        longDescription: project.longDescription || '',
        techStack: project.techStack ? project.techStack.join(', ') : '',
        repoUrl: project.repoUrl || '',
        liveUrl: project.liveUrl || '',
        screenshots: project.screenshots || [],
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
      setEditingProject(null);
      setFormState(initialProjectState);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.description || !firestore || !user) return;

    setIsSaving(true);
    const commonData = {
      ...formState,
      techStack: formState.techStack.split(',').map(s => s.trim()).filter(Boolean),
      screenshots: formState.screenshots,
      profileId: profileId,
      ownerId: user.uid,
    };
    
    try {
      if (editingProject) {
          const projectRef = doc(firestore, `profiles/${profileId}/projects/${editingProject.id}`);
          updateDocumentNonBlocking(projectRef, commonData);
      } else {
          if (!projectsQuery) return;
          addDocumentNonBlocking(projectsQuery, commonData);
      }
    } finally {
      setFormState(initialProjectState);
      setEditingProject(null);
      setIsSaving(false);
    }
  };

  const handleDeleteProject = (projId: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this project?')) return;
    const projRef = doc(firestore, `profiles/${profileId}/projects/${projId}`);
    deleteDocumentNonBlocking(projRef);
  };

  const { cloudName, uploadPreset } = gitprofileConfig.cloudinary;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
      </div>

      <div ref={formRef} className="card p-6 mb-6">
        <form onSubmit={handleSaveProject} className="space-y-4">
           <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
            {editingProject && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-sm btn-ghost">
                    <X size={16} /> Cancel
                </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Project Name" className={inputClass} required />
            <input type="text" name="repoUrl" value={formState.repoUrl} onChange={handleInputChange} placeholder="Repository URL" className={inputClass} />
            <input type="text" name="liveUrl" value={formState.liveUrl} onChange={handleInputChange} placeholder="Live URL" className={inputClass} />
          </div>
          <textarea name="description" value={formState.description} onChange={handleInputChange} placeholder="Short Description" className={textareaClass} required />
          
          <div>
            <label className="text-sm font-bold block mb-2">Long Description</label>
            <MdxEditor key={editingProject?.id || 'new-project'} markdown={formState.longDescription} onChange={handleMarkdownChange} placeholder="Full project details (for detail page)..." />
          </div>
          
          <textarea name="techStack" value={formState.techStack} onChange={handleInputChange} placeholder="Tech Stack (comma-separated, e.g., React, Next.js)" className={textareaClass} />
          
          <div>
            <CloudinaryUploader
                label="Project Screenshots"
                onUrlChange={handleScreenshotUpload}
                cloudName={cloudName}
                uploadPreset={uploadPreset}
                multiple
            />
            {formState.screenshots.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-bold mb-2">Uploaded Screenshots:</p>
                    <div className="flex flex-wrap gap-4">
                        {formState.screenshots.map((url, index) => (
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
          
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? <Loader size={16} className="animate-spin" /> : editingProject ? <Save size={16} /> : <Plus size={16} />}
            <span>{isSaving ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}</span>
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
                  <button onClick={() => handleEditClick(proj)} className="btn btn-sm btn-ghost">
                    <Edit size={16}/>
                  </button>
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
