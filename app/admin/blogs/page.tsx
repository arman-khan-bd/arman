'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Loader, Newspaper } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { CloudinaryUploader } from '../../../components/admin/CloudinaryUploader';
import { gitprofileConfig } from '../../../gitprofile.config';
import MdxEditor from '../../../components/admin/MdxEditor';

const initialBlogState = {
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
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ManageBlogsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newBlog, setNewBlog] = useState(initialBlogState);
  const [isAdding, setIsAdding] = useState(false);
  const profileId = gitprofileConfig.github.username;

  const blogsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `profiles/${profileId}/blogs`);
  }, [firestore, profileId]);

  const { data: blogs, isLoading } = useCollection(blogsQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMarkdownChange = (value: string) => {
    setNewBlog(prev => ({...prev, content: value}));
  }

  const handleUrlChange = (url: string | null) => {
    setNewBlog(prev => ({ ...prev, cover_image: url || '' }));
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !blogsQuery || !user) return;

    setIsAdding(true);
    const blogData = {
      ...newBlog,
      slug: createSlug(newBlog.title),
      date: new Date().toISOString(),
      categories: newBlog.categories.split(',').map(s => s.trim()).filter(Boolean),
      tags: newBlog.tags.split(',').map(s => s.trim()).filter(Boolean),
      profileId: profileId,
      ownerId: user.uid,
    };
    
    try {
      await addDocumentNonBlocking(blogsQuery, blogData);
    } finally {
      setNewBlog(initialBlogState);
      setIsAdding(false);
    }
  };

  const handleDeleteBlog = (blogId: string) => {
    if (!firestore) return;
    const blogRef = doc(firestore, `profiles/${profileId}/blogs/${blogId}`);
    deleteDocumentNonBlocking(blogRef);
  };
  
  const { cloudName, uploadPreset } = gitprofileConfig.cloudinary;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
      </div>
      
      <div className="card p-6 mb-6">
        <form onSubmit={handleAddBlog} className="space-y-4">
          <input type="text" name="title" value={newBlog.title} onChange={handleInputChange} placeholder="Blog Title" className={inputClass} required />
          <textarea name="description" value={newBlog.description} onChange={handleInputChange} placeholder="Short Description / Excerpt" className={textareaClass} required />
          
          <div>
            <label className="text-sm font-bold block mb-2">Blog Content</label>
            <MdxEditor markdown={newBlog.content} onChange={handleMarkdownChange} placeholder="Full blog content (Markdown supported)..."/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="categories" value={newBlog.categories} onChange={handleInputChange} placeholder="Categories (comma-separated)" className={inputClass} />
            <input type="text" name="tags" value={newBlog.tags} onChange={handleInputChange} placeholder="Tags (comma-separated)" className={inputClass} />
          </div>
          <CloudinaryUploader
              label="Cover Image"
              currentUrl={newBlog.cover_image}
              onUrlChange={handleUrlChange}
              cloudName={cloudName}
              uploadPreset={uploadPreset}
            />
          
          <button type="submit" className="btn btn-primary" disabled={isAdding}>
            {isAdding ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
            <span>{isAdding ? 'Adding Post...' : 'Add New Post'}</span>
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
