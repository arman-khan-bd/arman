'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { motion } from 'motion/react';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  cover_image: string;
  social_image: string;
}

export const BlogCard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!gitprofileConfig.blog.username) return;
      
      try {
        let url = '';
        if (gitprofileConfig.blog.source === 'dev') {
          url = `https://dev.to/api/articles?username=${gitprofileConfig.blog.username}&per_page=${gitprofileConfig.blog.limit}`;
        } else if (gitprofileConfig.blog.source === 'medium') {
          url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${gitprofileConfig.blog.username}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (gitprofileConfig.blog.source === 'dev') {
          setPosts(data);
        } else if (gitprofileConfig.blog.source === 'medium') {
          setPosts(data.items.slice(0, gitprofileConfig.blog.limit).map((item: any, index: number) => ({
            id: index,
            title: item.title,
            description: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
            url: item.link,
            published_at: item.pubDate,
            cover_image: item.thumbnail,
          })));
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (!gitprofileConfig.blog.username) return null;
  if (loading) return <div className="card h-64 animate-pulse bg-base-300" />;
  if (posts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent Posts</h2>
        <a 
          href={gitprofileConfig.blog.source === 'dev' ? `https://dev.to/${gitprofileConfig.blog.username}` : `https://medium.com/@${gitprofileConfig.blog.username}`} 
          target="_blank" 
          rel="noreferrer"
          className="text-primary text-sm font-medium hover:underline"
        >
          Read All
        </a>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card overflow-hidden hover:shadow-md transition-all group flex flex-col sm:flex-row"
          >
            {(post.cover_image || post.social_image) && (
              <div className="sm:w-1/3 aspect-video sm:aspect-auto relative overflow-hidden">
                <Image 
                  src={post.cover_image || post.social_image} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className={`p-6 flex flex-col flex-1 ${(post.cover_image || post.social_image) && 'sm:w-2/3'}`}>
              <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                <Calendar size={14} />
                <span>{format(new Date(post.published_at), 'MMM dd, yyyy')}</span>
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
