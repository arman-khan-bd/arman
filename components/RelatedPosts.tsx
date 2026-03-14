'use client';

import React from 'react';
import { getBlogs } from '../data/blogs';
import Link from 'next/link';
import { BookCopy } from 'lucide-react';
import { format } from 'date-fns';

interface RelatedPostsProps {
  currentSlug: string;
}

export const RelatedPosts = ({ currentSlug }: RelatedPostsProps) => {
  const relatedPosts = getBlogs(4).filter(p => p.slug !== currentSlug).slice(0, 3);
  
  if (relatedPosts.length === 0) return null;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <BookCopy size={20} />
        <span>Related Posts</span>
      </h3>
      <div className="space-y-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="block group"
          >
            <p className="font-bold group-hover:text-primary transition-colors line-clamp-2">{post.title}</p>
            <p className="text-xs text-base-content/60">{format(new Date(post.date), 'MMM dd, yyyy')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
