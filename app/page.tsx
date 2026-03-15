'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { ProfileCard, DetailsCard } from '../components/ProfileCards';
import { SkillsCard } from '../components/SkillsCard';
import { ExperienceCard, EducationCard } from '../components/TimelineCards';
import { ProjectsCard } from '../components/ProjectsCard';
import { BlogCard } from '../components/BlogCard';
import { ContactForm } from '../components/ContactForm';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '../src/firebase';
import { doc } from 'firebase/firestore';

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
  phone?: string;
};


export default function Home() {
  const firestore = useFirestore();
  const profileId = gitprofileConfig.github.username;

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !profileId) return null;
    return doc(firestore, 'profiles', profileId);
  }, [firestore, profileId]);

  const { data: profile, isLoading: loading } = useDoc<Profile>(profileRef);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeSwitcher phone={profile?.phone} />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="sm:col-span-1 space-y-4">
            <ProfileCard profile={profile} isLoading={loading} />
            <DetailsCard profile={profile} isLoading={loading} />
            <SkillsCard profileId={profileId} />
            <ExperienceCard profileId={profileId} />
            <EducationCard profileId={profileId} />
          </div>

          {/* Main Content */}
          <div className="sm:col-span-2 space-y-8">
            <ProjectsCard profileId={profileId} />
            <BlogCard profileId={profileId} />
            <ContactForm profileId={profileId} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-base-content/50 text-sm">
        <div className="flex items-center justify-center gap-1 mb-2">
          <span>Made with</span>
          <Heart size={14} className="text-red-500 fill-current" />
          <span>by</span>
          <a 
            href={`https://github.com/arifszn/gitprofile`} 
            target="_blank" 
            rel="noreferrer"
            className="font-bold text-base-content/80 hover:text-primary transition-colors"
          >
            {'gitprofile'}
          </a>
        </div>
        <p>© {new Date().getFullYear()} {profile?.displayName || 'Arman Ali Khan'}</p>
      </footer>
    </div>
  );
}
