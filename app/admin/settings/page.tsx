'use client';

import React, { useState, useEffect } from 'react';
import { Save, Braces, Globe, Search, User, Share2, Loader } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { gitprofileConfig } from '../../../gitprofile.config';

// Define a type for the profile, mirroring the backend.json entity
type Profile = {
  id?: string;
  ownerId?: string;
  displayName?: string;
  tagline?: string;
  logoImageUrl?: string;
  faviconUrl?: string;
  socialSharePhotoUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  googleAnalyticsId?: string;
  aboutMe?: string;
  location?: string;
  company?: string;
  linkedinUsername?: string;
  twitterUsername?: string;
  websiteUrl?: string;
  email?: string;
  profilePhotoUrl?: string;
  resumeUrl?: string;
  githubUsername?: string;
};


export default function ManageSettingsPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();

  const profileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `profiles/${user.uid}`);
  }, [user, firestore]);

  const { data: profileData, isLoading } = useDoc<Profile>(profileRef);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    } else if (!isLoading && user) {
      // If no data and not loading, initialize a default profile structure for a new user
      setProfile({
        ownerId: user.uid,
        id: user.uid,
        githubUsername: gitprofileConfig.github.username,
      });
    }
  }, [profileData, isLoading, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (!profileRef || !profile || !user) return;
    setIsSaving(true);
    
    const dataToSave: Profile = {
      ...profile,
      ownerId: user.uid,
      id: user.uid,
      githubUsername: gitprofileConfig.github.username,
    };

    setDocumentNonBlocking(profileRef, dataToSave, { merge: true });

    // Simulate save time and give feedback
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };
  
  const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
  const textareaClass = `${inputClass} min-h-[120px]`;

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Braces },
    { id: 'meta', label: 'Site Meta Data', icon: Globe },
    { id: 'seo', label: 'Advanced SEO', icon: Search },
    { id: 'about', label: 'About Me', icon: User },
    { id: 'socials', label: 'Address & Socials', icon: Share2 },
  ];
  
  if (isLoading || profile === null) {
     return (
       <div className="min-h-[50vh] flex items-center justify-center bg-base-200">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">General Settings</h1>
        <button className="btn btn-primary btn-sm" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
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
              <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold block mb-2">Logo Image URL</label>
                    <input type="text" name="logoImageUrl" value={profile.logoImageUrl || ''} onChange={handleInputChange} placeholder="https://example.com/logo.png" className={inputClass} />
                </div>
                <div>
                    <label className="text-sm font-bold block mb-2">Favicon URL (.ico, .svg, .png)</label>
                    <input type="text" name="faviconUrl" value={profile.faviconUrl || ''} onChange={handleInputChange} placeholder="https://example.com/favicon.ico" className={inputClass} />
                </div>
                <div>
                    <label className="text-sm font-bold block mb-2">Social Share Photo URL</label>
                    <input type="text" name="socialSharePhotoUrl" value={profile.socialSharePhotoUrl || ''} onChange={handleInputChange} placeholder="https://example.com/social.png" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Site Meta Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" name="displayName" value={profile.displayName || ''} onChange={handleInputChange} placeholder="Site Title" className={inputClass} />
                 <input type="text" name="tagline" value={profile.tagline || ''} onChange={handleInputChange} placeholder="Site Subtitle / Tagline" className={inputClass} />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Advanced SEO</h2>
              <div className="space-y-4">
                <textarea
                  name="metaDescription"
                  value={profile.metaDescription || ''}
                  onChange={handleInputChange}
                  className={textareaClass}
                  placeholder="Meta Description (for SEO, max 160 characters)"
                ></textarea>
                <input type="text" name="metaKeywords" value={profile.metaKeywords || ''} onChange={handleInputChange} placeholder="Meta Keywords (comma-separated)" className={inputClass} />
                <div>
                  <label className="text-sm font-bold block mb-2">Analytics</label>
                  <input type="text" name="googleAnalyticsId" value={profile.googleAnalyticsId || ''} onChange={handleInputChange} placeholder="Google Analytics ID" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
             <div className="space-y-8">
              <h2 className="text-xl font-bold">About Me</h2>
              <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold block mb-2">Profile Photo URL</label>
                    <input type="text" name="profilePhotoUrl" value={profile.profilePhotoUrl || ''} onChange={handleInputChange} placeholder="https://example.com/profile.png" className={inputClass} />
                </div>
                <div>
                    <label className="text-sm font-bold block mb-2">Resume URL (PDF)</label>
                    <input type="text" name="resumeUrl" value={profile.resumeUrl || ''} onChange={handleInputChange} placeholder="https://example.com/resume.pdf" className={inputClass} />
                </div>
                <textarea
                  name="aboutMe"
                  value={profile.aboutMe || ''}
                  onChange={handleInputChange}
                  className={textareaClass}
                  placeholder="Write a short bio..."
                ></textarea>
              </div>
            </div>
          )}
          
          {activeTab === 'socials' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold">Address & Socials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" name="location" value={profile.location || ''} onChange={handleInputChange} placeholder="Location" className={inputClass} />
                 <input type="text" name="company" value={profile.company || ''} onChange={handleInputChange} placeholder="Company" className={inputClass} />
                 <input type="text" name="linkedinUsername" value={profile.linkedinUsername || ''} onChange={handleInputChange} placeholder="LinkedIn username" className={inputClass} />
                 <input type="text" name="twitterUsername" value={profile.twitterUsername || ''} onChange={handleInputChange} placeholder="Twitter username" className={inputClass} />
                 <input type="text" name="websiteUrl" value={profile.websiteUrl || ''} onChange={handleInputChange} placeholder="https://armankhan.me" className={inputClass} />
                 <input type="email" name="email" value={profile.email || ''} onChange={handleInputChange} placeholder="Email" className={inputClass} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
