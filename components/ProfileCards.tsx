'use client';

import React from 'react';
import Image from 'next/image';
import { gitprofileConfig } from '../gitprofile.config';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface GitHubUser {
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  twitter_username: string;
  html_url: string;
}

export const ProfileCard = ({ user }: { user: GitHubUser | null }) => {
  if (!user) return <div className="animate-pulse bg-base-300 h-96 rounded-xl" />;

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
              src={user.avatar_url} 
              alt="Arman Ali Khan" 
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Arman Ali Khan</h1>
        <p className="text-base-content/70 mb-6 max-w-xs">Full Stack Developer passionate about building modern web applications.</p>
        
        {gitprofileConfig.resume.fileUrl && (
          <a 
            href={gitprofileConfig.resume.fileUrl} 
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

export const DetailsCard = ({ user }: { user: GitHubUser | null }) => {
  if (!user) return <div className="animate-pulse bg-base-300 h-64 rounded-xl mt-4" />;

  const details = [
    { icon: <MapPin size={18} />, label: 'Location', value: user.location || 'Planet Earth' },
    { icon: <Github size={18} />, label: 'GitHub', value: gitprofileConfig.github.username, link: `https://github.com/${gitprofileConfig.github.username}` },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', value: gitprofileConfig.social.linkedin, link: `https://linkedin.com/in/${gitprofileConfig.social.linkedin}` },
    { icon: <Twitter size={18} />, label: 'Twitter', value: gitprofileConfig.social.twitter, link: `https://twitter.com/${gitprofileConfig.social.twitter}` },
    { icon: <Globe size={18} />, label: 'Website', value: gitprofileConfig.social.website, link: gitprofileConfig.social.website },
    { icon: <Mail size={18} />, label: 'Email', value: gitprofileConfig.social.email, link: `mailto:${gitprofileConfig.social.email}` },
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
