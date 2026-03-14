'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { getBlogBySlug } from '../../../data/blogs';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { CommentSection } from '../../../components/CommentSection';
import { RelatedPosts } from '../../../components/RelatedPosts';
import { CategoriesCard } from '../../../components/CategoriesCard';
import { TagsCard } from '../../../components/TagsCard';

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const blog = useMemo(() => {
    if (!slug) return null;
    return getBlogBySlug(decodeURIComponent(slug));
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Blog post not found.
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
                />
              </div>

              <article className="prose lg:prose-xl max-w-none prose-h1:text-primary prose-headings:font-bold prose-a:text-primary hover:prose-a:underline">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </article>
              
              <CommentSection />
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            <RelatedPosts currentSlug={blog.slug} />
            <CategoriesCard />
            <TagsCard />
          </aside>
        </div>
      </main>
    </div>
  );
}
