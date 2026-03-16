'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, ServerCrash } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { format } from 'date-fns';
import { CommentSection } from '../../../components/CommentSection';
import { RelatedPosts } from '../../../components/RelatedPosts';
import { CategoriesCard } from '../../../components/CategoriesCard';
import { TagsCard } from '../../../components/TagsCard';
import { gitprofileConfig } from '../../../gitprofile.config';

interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  cover_image: string;
  content: string;
  categories: string[];
  tags: string[];
}

export default function BlogClientPage({ blog }: { blog: Blog | null }) {
  const router = useRouter();
  const profileId = gitprofileConfig.github.username;

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <ServerCrash size={64} className="text-primary mb-4" />
        <h1 className="text-3xl font-bold">Blog Post Not Found</h1>
        <p className="text-base-content/60 mt-2">
          The blog post you're looking for doesn't seem to exist or couldn't be loaded.
        </p>
        <button 
            onClick={() => router.back()}
            className="mt-8 flex items-center gap-2 text-sm font-bold btn btn-primary"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-bold truncate max-w-[200px] md:max-w-none">{blog.title}</h1>
          <div className="w-10 md:w-20" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
                <div className="flex items-center gap-2 text-sm text-base-content/50">
                  <Calendar size={14} />
                  <span>{format(new Date(blog.date), 'MMMM dd, yyyy')}</span>
                </div>
              </div>

              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={blog.cover_image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>

              <article className="prose prose-invert lg:prose-xl max-w-none prose-h1:text-primary prose-headings:font-bold prose-a:text-primary hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{blog.content}</ReactMarkdown>
              </article>
              
              {profileId && blog.id && blog.slug && <CommentSection profileId={profileId} blogId={blog.id} blogSlug={blog.slug} />}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            <RelatedPosts currentSlug={blog.slug} profileId={profileId} />
            <CategoriesCard profileId={profileId} />
            <TagsCard profileId={profileId} />
          </aside>
        </div>
      </main>
    </div>
  );
}
