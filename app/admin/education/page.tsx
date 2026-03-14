import React from 'react';
import { Plus } from 'lucide-react';

export default function ManageEducationPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Education</h1>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>
      <div className="card p-6">
        <p className="text-base-content/60">No education entries found.</p>
      </div>
    </div>
  );
}
