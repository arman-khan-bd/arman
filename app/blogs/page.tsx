'use client';

import React from 'react';
import { BlogCard } from '../../components/BlogCard';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { gitprofileConfig } from '../../gitprofile.config';


export default function AllBlogsPage() {
  const profileId = gitprofileConfig.github.username;
  
  return (
    <div className="min-h-screen bg-base-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-lg font-bold">All Blogs</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BlogCard 
            limit={0} // Using limit 0 enables pagination
            showTitle={false} 
            showSeeAll={false}
            profileId={profileId}
            listView={true} // Enable list view
          />
        </motion.div>
      </main>
    </div>
  );
}
