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
import { useFirestore } from '../src/firebase';
import { collection, query, getDocs, doc, getDoc, limit as firestoreLimit } from 'firebase/firestore';

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
    const fetchProfileData = async () => {
      if (!firestore) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Step 1: Fetch Profile ID
        const profilesCollection = collection(firestore, 'profiles');
        const q = query(profilesCollection, firestoreLimit(1));
        const profileSnapshot = await getDocs(q);
        
        if (profileSnapshot.empty) {
          console.log("No profile found, using static config for fallback.");
          setProfile(null);
          setLoading(false);
          return;
        }
        
        const fetchedProfileId = profileSnapshot.docs[0].id;
        setProfileId(fetchedProfileId);
        
        // Step 2: Fetch Profile Document with the ID
        const profileRef = doc(firestore, 'profiles', fetchedProfileId);
        const profileDoc = await getDoc(profileRef);
        
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as Profile);
        } else {
          console.log("Profile document not found for ID:", fetchedProfileId);
          setProfile(null);
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [firestore]);


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
