import React from 'react';
import { Save } from 'lucide-react';

export default function ManageSettingsPage() {
  const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
  const textareaClass = `${inputClass} min-h-[120px]`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">General Settings</h1>
        <button className="btn btn-primary btn-sm">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>
      <div className="card p-6 lg:p-8 space-y-8">
        
        {/* Branding Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Logo Image URL" className={inputClass} />
             <input type="text" placeholder="Favicon URL" className={inputClass} />
             <input type="text" placeholder="Social Share Photo URL" className={inputClass} />
          </div>
        </div>

        {/* Meta Data Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Site Meta Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Site Title" className={inputClass} />
             <input type="text" placeholder="Site Subtitle / Tagline" className={inputClass} />
          </div>
        </div>

        {/* SEO Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Advanced SEO</h2>
          <div className="space-y-4">
            <textarea
              className={textareaClass}
              placeholder="Meta Description (for SEO, max 160 characters)"
            ></textarea>
            <input type="text" placeholder="Meta Keywords (comma-separated)" className={inputClass} />
          </div>
        </div>
        
        {/* About Me Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">About Me</h2>
          <textarea
            className={textareaClass}
            placeholder="Write a short bio..."
          ></textarea>
        </div>

        {/* Address & Socials Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Address & Socials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Location" className={inputClass} />
             <input type="text" placeholder="Company" className={inputClass} />
             <input type="text" placeholder="LinkedIn username" className={inputClass} />
             <input type="text" placeholder="Twitter username" className={inputClass} />
             <input type="text" placeholder="Website URL" className={inputClass} />
             <input type="email" placeholder="Email" className={inputClass} />
          </div>
        </div>

      </div>
    </div>
  );
}