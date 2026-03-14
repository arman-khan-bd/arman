'use client';

import React, { useState } from 'react';
import { Save, Braces, Globe, Search, User, Share2 } from 'lucide-react';

export default function ManageSettingsPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
  const textareaClass = `${inputClass} min-h-[120px]`;

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Braces },
    { id: 'meta', label: 'Site Meta Data', icon: Globe },
    { id: 'seo', label: 'Advanced SEO', icon: Search },
    { id: 'about', label: 'About Me', icon: User },
    { id: 'socials', label: 'Address & Socials', icon: Share2 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">General Settings</h1>
        <button className="btn btn-primary btn-sm">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>
      <div className="card">
        {/* Tabs Navigation */}
        <div className="flex border-b border-base-300 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-base-content/60 hover:text-primary'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-6 lg:p-8">
          {activeTab === 'branding' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Branding</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Logo Image URL" className={inputClass} />
                 <input type="text" placeholder="Favicon URL" className={inputClass} />
                 <input type="text" placeholder="Social Share Photo URL" className={inputClass} />
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Site Meta Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Site Title" className={inputClass} />
                 <input type="text" placeholder="Site Subtitle / Tagline" className={inputClass} />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Advanced SEO</h2>
              <div className="space-y-4">
                <textarea
                  className={textareaClass}
                  placeholder="Meta Description (for SEO, max 160 characters)"
                ></textarea>
                <input type="text" placeholder="Meta Keywords (comma-separated)" className={inputClass} />
                <div>
                  <label className="text-sm font-bold block mb-2">Analytics</label>
                  <input type="text" placeholder="Google Analytics ID" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">About Me</h2>
              <textarea
                className={textareaClass}
                placeholder="Write a short bio..."
              ></textarea>
            </div>
          )}
          
          {activeTab === 'socials' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Address & Socials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Location" className={inputClass} />
                 <input type="text" placeholder="Company" className={inputClass} />
                 <input type="text" placeholder="LinkedIn username" className={inputClass} />
                 <input type="text" placeholder="Twitter username" className={inputClass} />
                 <input type="text" placeholder="Website URL" className={inputClass} />
                 <input type="email" placeholder="Email" className={inputClass} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}