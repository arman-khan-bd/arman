import React from 'react';
import { Save } from 'lucide-react';

export default function ManageSettingsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button className="btn btn-primary btn-sm">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>
      <div className="card p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">About Me</h2>
          <textarea
            className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px]"
            placeholder="Write a short bio..."
          ></textarea>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Address & Socials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Location" className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
             <input type="text" placeholder="Company" className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
             <input type="text" placeholder="LinkedIn username" className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
             <input type="text" placeholder="Twitter username" className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
             <input type="text" placeholder="Website URL" className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
             <input type="email" placeholder="Email" className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
