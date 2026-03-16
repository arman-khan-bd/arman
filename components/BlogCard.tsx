'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { BookOpen, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, query, limit as firestoreLimit, orderBy, getDocs, startAfter, DocumentSnapshot } from 'firebase/firestore';

interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  cover_image: string;
  content: string; // Markdown content
  categories: string[];
  tags: string[];
}

interface BlogCardProps {
  limit?: number; // For grid view, it's the total. For list view, it's page size.
  showTitle?: boolean;
  showSeeAll?: boolean;
  profileId: string | null;
  listView?: boolean;
}

export const BlogCard = ({ 
  limit = 6, 
  showTitle = true, 
  showSeeAll = true,
  profileId,
  listView = false,
}: BlogCardProps) => {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const firestore = useFirestore();

  const loadMoreRef = useRef(null);
  // Re-trigger when the element is 200px away from the viewport
  const isInView = useInView(loadMoreRef, { once: false, margin: "200px" });

  const fetchPosts = useCallback(async (loadMore = false) => {
    if (!profileId || !firestore) {
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    try {
      const blogsCollection = collection(firestore, `profiles/${profileId}/blogs`);
      let q = query(blogsCollection, orderBy('date', 'desc'));

      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }
      
      const currentLimit = (limit === 0 && listView) ? 10 : limit;
      q = query(q, firestoreLimit(currentLimit));

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[];
      
      setPosts(prev => loadMore ? [...prev, ...newPosts] : newPosts);
      
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastDoc || null);

      if (snapshot.docs.length < currentLimit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [profileId, firestore, lastVisible, limit, listView]);

  // Initial fetch or re-fetch when key props change
  useEffect(() => {
    setPosts([]);
    setLastVisible(null);
    setHasMore(true);
    fetchPosts(false);
  }, [profileId]); // Only re-run full fetch if profileId changes

  // Infinite scroll trigger
  useEffect(() => {
    if (isInView && hasMore && !isLoading && listView) {
      fetchPosts(true);
    }
  }, [isInView, hasMore, isLoading, listView, fetchPosts]);


  if (isLoading && posts.length === 0) {
    const skeletonCount = (limit === 0 || limit > 4) ? 4 : limit;
    const skeletonClass = listView ? "card h-40 animate-pulse bg-base-300" : "card h-80 animate-pulse bg-base-300";
    return (
      <div className={listView ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className={skeletonClass} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  // LIST VIEW
  if (listView) {
    return (
      <div className="space-y-6">
        <div className="space-y-8">
          {posts.map((post) => (
             <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="card flex flex-col md:flex-row items-center gap-6 p-6 hover:shadow-lg transition-shadow duration-300 group bg-base-100"
                >
                  <div className="w-full md:w-1/3 aspect-video relative rounded-lg overflow-hidden shrink-0">
                      <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                      />
                  </div>
                  <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-base-content/50 mb-2">
                          <Calendar size={14} />
                          <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
                      </div>
                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                      </h3>
                      <p className="text-base-content/70 line-clamp-3 mb-4">
                          {post.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <span>Read More</span>
                        <BookOpen size={16} />
                      </div>
                  </div>
                </Link>
            </motion.div>
          ))}
        </div>

        {hasMore && (
           <div ref={loadMoreRef} className="flex justify-center items-center py-8">
             {isLoading && <Loader2 size={32} className="animate-spin text-primary" />}
           </div>
        )}
      </div>
    );
  }
  
  // GRID VIEW (Default for home page)
  return (
    <div className="space-y-6">
      {(showTitle || showSeeAll) && (
        <div className="flex justify-between items-center">
          {showTitle && <h2 className="text-xl font-bold">Recent Posts</h2>}
          {showSeeAll && posts.length > 0 && limit !== 0 && (
            <Link href="/blogs" className="text-primary text-sm font-medium hover:underline">
              Read All
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blogs/${post.slug}`} className="card overflow-hidden hover:shadow-md transition-all group flex flex-col h-full bg-base-100">
              <div className="aspect-video relative overflow-hidden">
                <Image 
                  src={post.cover_image} 
                  alt={post.title}
                  width={300}
                  height={200}
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
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
