'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Folder } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs, limit as firestoreLimit } from 'firebase/firestore';

interface BlogForCategories {
  categories: string[];
}

export const CategoriesCard = () => {
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

  const { data: blogs, isLoading } = useCollection<BlogForCategories>(blogsQuery);

  const categories = useMemo(() => {
    if (!blogs) return [];
    const allCategories = blogs.flatMap(blog => blog.categories || []);
    return [...new Set(allCategories)];
  }, [blogs]);

  if (isLoading) {
    return <div className="card p-6 h-32 animate-pulse bg-base-300" />;
  }

  if (categories.length === 0) return null;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Folder size={20} />
        <span>Categories</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <a key={category} href="#" className="px-3 py-1 bg-base-200 text-sm rounded-full hover:bg-primary hover:text-primary-content transition-colors">
            {category}
          </a>
        ))}
      </div>
    </div>
  );
};
