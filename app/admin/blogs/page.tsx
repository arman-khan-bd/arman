import React from 'react';
import { Plus } from 'lucide-react';

export default function ManageBlogsPage() {
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
        <p className="text-base-content/60">No blog posts found. Add one to get started.</p>
      </div>
    </div>
  );
}
