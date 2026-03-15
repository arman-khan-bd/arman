'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Tag } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

interface BlogForTags {
  tags: string[];
}

interface TagsCardProps {
  profileId: string | null;
}

export const TagsCard = ({ profileId }: TagsCardProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !profileId) {
      setIsLoading(false);
      return;
    }

    const fetchBlogsForTags = async () => {
      setIsLoading(true);
      try {
        const blogsQuery = query(collection(firestore, `profiles/${profileId}/blogs`));
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsData = blogsSnapshot.docs.map(doc => doc.data()) as BlogForTags[];
        const allTags = blogsData.flatMap(blog => blog.tags || []);
        setTags([...new Set(allTags)]);
      } catch (e) {
        console.error("Error fetching tags:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogsForTags();
  }, [firestore, profileId]);


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
