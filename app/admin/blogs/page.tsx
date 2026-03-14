'use client';

import React from 'react';
import { Plus, Newspaper } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { format } from 'date-fns';

export default function ManageBlogsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const blogsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/blogs`);
  }, [user, firestore]);

  const { data: blogs, isLoading } = useCollection(blogsQuery);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Post</span>
        </button>
      </div>
      <div className="card p-6">
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
                  <button className="btn btn-sm">Edit</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
    