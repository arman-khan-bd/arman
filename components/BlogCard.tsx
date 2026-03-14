'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { getBlogs } from '../data/blogs';
import Link from 'next/link';

interface BlogCardProps {
  limit?: number;
  showTitle?: boolean;
  showSeeAll?: boolean;
}

export const BlogCard = ({ 
  limit = 6, 
  showTitle = true, 
  showSeeAll = true 
}: BlogCardProps) => {
  const posts = getBlogs(limit === 0 ? undefined : limit);

  if (posts.length === 0) return null;

  return (
    <div className="space-y-6">
      {(showTitle || showSeeAll) && (
        <div className="flex justify-between items-center">
          {showTitle && <h2 className="text-xl font-bold">Recent Posts</h2>}
          {showSeeAll && (
            <Link 
              href="/blogs"
              className="text-primary text-sm font-medium hover:underline"
            >
              Read All
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <motion.a
            key={post.slug}
            href={`/blogs/${post.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card overflow-hidden hover:shadow-md transition-all group flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden">
              <Image 
                src={post.cover_image} 
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                <Calendar size={14} />
                <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-base-content/60 line-clamp-2 mb-4 flex-1">
                {post.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <span>Read More</span>
                <BookOpen size={16} />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
