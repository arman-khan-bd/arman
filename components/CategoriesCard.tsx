'use client';

import React from 'react';
import { getCategories } from '../data/blogs';
import { Folder } from 'lucide-react';

export const CategoriesCard = () => {
  const categories = getCategories();
  
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
