'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { ProfileCard, DetailsCard } from '../components/ProfileCards';
import { SkillsCard } from '../components/SkillsCard';
import { ExperienceCard, EducationCard } from '../components/TimelineCards';
import { ProjectsCard } from '../components/ProjectsCard';
import { BlogCard } from '../components/BlogCard';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '../src/firebase';
import { collection, query, getDocs, doc, limit as firestoreLimit } from 'firebase/firestore';

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (firestore) {
      const fetchProfileId = async () => {
        try {
          const profilesCollection = collection(firestore, 'profiles');
          const q = query(profilesCollection, firestoreLimit(1));
          const profileSnapshot = await getDocs(q);
          if (!profileSnapshot.empty) {
            setProfileId(profileSnapshot.docs[0].id);
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching profile ID:", error);
          setLoading(false);
        }
      };
      fetchProfileId();
    } else if (firestore === null) { // Firestore is initialized but not available
      setLoading(false);
    }
  }, [firestore]);

  const profileRef = useMemoFirebase(() => {
    if (!profileId || !firestore) return null;
    return doc(firestore, 'profiles', profileId);
  }, [profileId, firestore]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc<Profile>(profileRef);

  useEffect(() => {
    if (!isProfileLoading) {
        setProfile(profileData);
        setLoading(false);
    }
  }, [profileData, isProfileLoading]);

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
            href={`https://github.com/${profile?.githubUsername || gitprofileConfig.github.username}`} 
            target="_blank" 
            rel="noreferrer"
            className="font-bold text-base-content/80 hover:text-primary transition-colors"
          >
            {profile?.displayName || 'Arman Ali Khan'}
          </a>
        </div>
        <p>© {new Date().getFullYear()} {profile?.displayName || 'Arman Ali Khan'}</p>
      </footer>
    </div>
  );
}
