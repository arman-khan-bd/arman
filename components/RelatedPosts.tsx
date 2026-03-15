'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { BookCopy } from 'lucide-react';
import { format } from 'date-fns';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs, limit as firestoreLimit, orderBy } from 'firebase/firestore';

interface RelatedPostsProps {
  currentSlug: string;
}

interface Blog {
  slug: string;
  title: string;
  date: string;
}

export const RelatedPosts = ({ currentSlug }: RelatedPostsProps) => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (firestore) {
        const profilesCollection = collection(firestore, 'profiles');
        const q = query(profilesCollection, firestoreLimit(1));
        const profileSnapshot = await getDocs(q);
        if (!profileSnapshot.empty) {
          setProfileId(profileSnapshot.docs[0].id);
        }
      }
    };
    fetchProfile();
  }, [firestore]);

  const blogsQuery = useMemoFirebase(() => {
    if (!profileId) return null;
    return query(
        collection(firestore, `profiles/${profileId}/blogs`),
        orderBy('date', 'desc'),
        firestoreLimit(4)
    );
  }, [profileId, firestore]);

  const { data: latestPosts, isLoading } = useCollection<Blog>(blogsQuery);
  
  const relatedPosts = useMemo(() => {
    return latestPosts?.filter(p => p.slug !== currentSlug).slice(0, 3)
  }, [latestPosts, currentSlug]);

  if (isLoading) {
    return <div className="card p-6 h-40 animate-pulse bg-base-300" />;
  }
  
  if (!relatedPosts || relatedPosts.length === 0) return null;

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
