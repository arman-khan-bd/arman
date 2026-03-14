'use client';

import React from 'react';
import { getTags } from '../data/blogs';
import { Tag } from 'lucide-react';

export const TagsCard = () => {
  const tags = getTags();

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
