'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { ProfileCard, DetailsCard } from '@/components/ProfileCards';
import { SkillsCard } from '@/components/SkillsCard';
import { ExperienceCard, EducationCard } from '@/components/TimelineCards';
import { ProjectsCard } from '@/components/ProjectsCard';
import { BlogCard } from '@/components/BlogCard';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${gitprofileConfig.github.username}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeSwitcher />
      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <ProfileCard user={user} />
            <DetailsCard user={user} />
            <SkillsCard />
            <ExperienceCard />
            <EducationCard />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <ProjectsCard />
            <BlogCard />
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
            href={`https://github.com/${gitprofileConfig.github.username}`} 
            target="_blank" 
            rel="noreferrer"
            className="font-bold text-base-content/80 hover:text-primary transition-colors"
          >
            {user ? (user as any).name || gitprofileConfig.github.username : gitprofileConfig.github.username}
          </a>
        </div>
        <p>© {new Date().getFullYear()} GitProfile Clone</p>
      </footer>
    </div>
  );
}
