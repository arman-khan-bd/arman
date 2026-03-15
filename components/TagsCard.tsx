'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Tag } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs, limit as firestoreLimit } from 'firebase/firestore';

interface BlogForTags {
  tags: string[];
}

export const TagsCard = () => {
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
    return query(collection(firestore, `profiles/${profileId}/blogs`));
  }, [profileId, firestore]);
  
  const { data: blogs, isLoading } = useCollection<BlogForTags>(blogsQuery);

  const tags = useMemo(() => {
    if (!blogs) return [];
    const allTags = blogs.flatMap(blog => blog.tags || []);
    return [...new Set(allTags)];
  }, [blogs]);

  if (isLoading) {
    return <div className="card p-6 h-32 animate-pulse bg-base-300" />;
  }

  if (tags.length === 0) return null;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Tag size={20} />
        <span>Tags</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <a key={tag} href="#" className="px-3 py-1 bg-base-200 text-sm rounded-full hover:bg-secondary hover:text-primary-content transition-colors">
            #{tag}
          </a>
        ))}
      </div>
    </div>
  );
};
