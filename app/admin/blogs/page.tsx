'use client';

import React, { useState, useRef } from 'react';
import { Plus, Trash2, Loader, Edit, Save, X } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { CloudinaryUploader } from '../../../components/admin/CloudinaryUploader';
import { gitprofileConfig } from '../../../gitprofile.config';
import MdxEditor from '../../../components/admin/MdxEditor';

// Combined interface for blog data
interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  cover_image: string;
  categories: string[];
  tags: string[];
  slug: string;
  date: string;
  profileId: string;
  ownerId: string;
}

// Type for the form state
type BlogFormState = {
  title: string;
  description: string;
  content: string;
  cover_image: string;
  categories: string; // Stored as comma-separated string in form
  tags: string; // Stored as comma-separated string in form
};

const initialBlogState: BlogFormState = {
  title: '',
  description: '',
  content: '',
  cover_image: '',
  categories: '',
  tags: '',
};

const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
const textareaClass = `${inputClass} min-h-[120px]`;

const createSlug = (title: string) => {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\p{L}\p{N}-]/gu, '') // Remove invalid chars
    .replace(/-+/g, '-'); // Collapse dashes
}

export default function ManageBlogsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [formState, setFormState] = useState<BlogFormState>(initialBlogState);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const profileId = gitprofileConfig.github.username;
  const formRef = useRef<HTMLDivElement>(null);


  const blogsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `profiles/${profileId}/blogs`);
  }, [firestore, profileId]);

  const { data: blogs, isLoading } = useCollection<Blog>(blogsQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMarkdownChange = (value: string) => {
    setFormState(prev => ({...prev, content: value}));
  }

  const handleUrlChange = (url: string | null) => {
    setFormState(prev => ({ ...prev, cover_image: url || '' }));
  };
  
  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setFormState({
        ...blog,
        categories: blog.categories.join(', '),
        tags: blog.tags.join(', '),
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handleCancelEdit = () => {
    setEditingBlog(null);
    setFormState(initialBlogState);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.content || !firestore || !user) return;

    setIsSaving(true);
    
    const commonData = {
        ...formState,
        slug: createSlug(formState.title),
        categories: formState.categories.split(',').map(s => s.trim()).filter(Boolean),
        tags: formState.tags.split(',').map(s => s.trim()).filter(Boolean),
        profileId: profileId,
        ownerId: user.uid,
    };

    try {
      if (editingBlog) {
        // Update existing blog
        const blogRef = doc(firestore, `profiles/${profileId}/blogs/${editingBlog.id}`);
        updateDocumentNonBlocking(blogRef, {
            ...commonData,
            date: editingBlog.date, // Preserve original date on update
        });
      } else {
        // Add new blog
        const newBlogData = {
          ...commonData,
          date: new Date().toISOString(),
        }
        if (!blogsQuery) return;
        addDocumentNonBlocking(blogsQuery, newBlogData);
      }
    } finally {
      setFormState(initialBlogState);
      setEditingBlog(null);
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = (blogId: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this blog post?')) return;
    deleteDocumentNonBlocking(doc(firestore, `profiles/${profileId}/blogs/${blogId}`));
  };
  
  const { cloudName, uploadPreset } = gitprofileConfig.cloudinary;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
      </div>
      
      <div ref={formRef} className="card p-6 mb-6">
        <form onSubmit={handleSaveBlog} className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{editingBlog ? 'Edit Post' : 'Create New Post'}</h2>
            {editingBlog && (
                <button type="button" onClick={handleCancelEdit} className="btn btn-sm btn-ghost">
                    <X size={16} /> Cancel
                </button>
            )}
          </div>
          <input type="text" name="title" value={formState.title} onChange={handleInputChange} placeholder="Blog Title" className={inputClass} required />
          <textarea name="description" value={formState.description} onChange={handleInputChange} placeholder="Short Description / Excerpt" className={textareaClass} required />
          
          <div>
            <label className="text-sm font-bold block mb-2">Blog Content</label>
            <MdxEditor key={editingBlog?.id || 'new-blog'} markdown={formState.content} onChange={handleMarkdownChange} placeholder="Full blog content (Markdown supported)..."/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="categories" value={formState.categories} onChange={handleInputChange} placeholder="Categories (comma-separated)" className={inputClass} />
            <input type="text" name="tags" value={formState.tags} onChange={handleInputChange} placeholder="Tags (comma-separated)" className={inputClass} />
          </div>
          <CloudinaryUploader
              label="Cover Image"
              currentUrl={formState.cover_image}
              onUrlChange={handleUrlChange}
              cloudName={cloudName}
              uploadPreset={uploadPreset}
            />
          
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? <Loader size={16} className="animate-spin" /> : editingBlog ? <Save size={16}/> : <Plus size={16} />}
            <span>{isSaving ? 'Saving...' : editingBlog ? 'Update Post' : 'Add New Post'}</span>
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Existing Posts</h2>
        {isLoading && (
           <div className="flex justify-center items-center">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
        {!isLoading && (!blogs || blogs.length === 0) && (
          <p className="text-base-content/60">No blog posts found. Add one to get started.</p>
        )}
        {!isLoading && blogs && blogs.length > 0 && (
          <div className="space-y-4">
            {blogs.map(blog => (
              <div key={blog.id} className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{blog.title}</h3>
                  <p className="text-sm text-base-content/60">
                    Published on {format(new Date(blog.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                 <div className="flex gap-2">
                  <button onClick={() => handleEditClick(blog)} className="btn btn-sm btn-ghost">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteBlog(blog.id)} className="btn btn-sm btn-error">
                    <Trash2 size={16} />
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
