'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Folder } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs, limit as firestoreLimit } from 'firebase/firestore';

interface BlogForCategories {
  categories: string[];
}

export const CategoriesCard = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) {
      setIsLoading(false);
      return;
    }

    const fetchBlogsForCategories = async () => {
      setIsLoading(true);
      try {
        const profilesCollection = collection(firestore, 'profiles');
        const profileQuery = query(profilesCollection, firestoreLimit(1));
        const profileSnapshot = await getDocs(profileQuery);
        
        if (!profileSnapshot.empty) {
          const profileId = profileSnapshot.docs[0].id;
          const blogsQuery = query(collection(firestore, `profiles/${profileId}/blogs`));
          const blogsSnapshot = await getDocs(blogsQuery);
          const blogsData = blogsSnapshot.docs.map(doc => doc.data()) as BlogForCategories[];
          const allCategories = blogsData.flatMap(blog => blog.categories || []);
          setCategories([...new Set(allCategories)]);
        }
      } catch(e) {
        console.error("Error fetching categories:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogsForCategories();
  }, [firestore]);

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
