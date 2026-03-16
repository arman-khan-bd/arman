'use client';

import React from 'react';
import Image from 'next/image';
import { gitprofileConfig } from '../gitprofile.config';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';

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

interface ProfileCardProps {
  profile: Profile | null;
  isLoading: boolean;
}

export const ProfileCard = ({ profile, isLoading }: ProfileCardProps) => {
  if (isLoading) return <div className="animate-pulse bg-base-300 h-96 rounded-xl" />;

  const displayName = profile?.displayName || gitprofileConfig.github.username;
  const aboutMe = profile?.aboutMe || "Full Stack Developer passionate about building modern web applications.";
  const profilePhotoUrl = profile?.profilePhotoUrl || 'https://avatars.githubusercontent.com/u/101010?v=4'; // Fallback
  const resumeUrl = profile?.resumeUrl || gitprofileConfig.resume.fileUrl;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 shadow-xl overflow-hidden border border-base-300"
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div className="avatar mb-6">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
            <Image 
              src={profilePhotoUrl} 
              alt={displayName} 
              width={200}
              height={200}
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
        <p className="text-base-content/70 mb-6 max-w-xs">{aboutMe}</p>
        
        {resumeUrl && (
          <a 
            href={resumeUrl} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-primary btn-sm rounded-full px-6"
          >
            Download Resume
          </a>
        )}
      </div>
    </motion.div>
  );
};

interface DetailsCardProps {
  profile: Profile | null;
  isLoading: boolean;
}


export const DetailsCard = ({ profile, isLoading }: DetailsCardProps) => {
  if (isLoading) return <div className="animate-pulse bg-base-300 h-64 rounded-xl mt-4" />;
  
  const githubUsername = profile?.githubUsername || gitprofileConfig.github.username;
  const linkedinUsername = profile?.linkedinUsername || gitprofileConfig.social.linkedin;
  const twitterUsername = profile?.twitterUsername || gitprofileConfig.social.twitter;
  const websiteUrl = profile?.websiteUrl || gitprofileConfig.social.website;
  const email = profile?.email || gitprofileConfig.social.email;

  const details = [
    { icon: <MapPin size={18} />, label: 'Location', value: profile?.location || 'Planet Earth' },
    { icon: <Github size={18} />, label: 'GitHub', value: githubUsername, link: `https://github.com/${githubUsername}` },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', value: linkedinUsername, link: `https://linkedin.com/in/${linkedinUsername}` },
    { icon: <Twitter size={18} />, label: 'Twitter', value: twitterUsername, link: `https://twitter.com/${twitterUsername}` },
    { icon: <Globe size={18} />, label: 'Website', value: websiteUrl, link: websiteUrl },
    { icon: <Mail size={18} />, label: 'Email', value: email, link: `mailto:${email}` },
  ].filter(item => item.value);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card bg-base-100 shadow-xl mt-4 border border-base-300"
    >
      <div className="p-6 space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center gap-4 text-sm">
            <span className="text-primary">{detail.icon}</span>
            <div className="flex flex-col">
              <span className="text-base-content/50 text-xs uppercase font-semibold tracking-wider">{detail.label}</span>
              {detail.link ? (
                <a href={detail.link} target="_blank" rel="noreferrer" className="hover:underline break-all">
                  {detail.value}
                </a>
              ) : (
                <span className="break-all">{detail.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
