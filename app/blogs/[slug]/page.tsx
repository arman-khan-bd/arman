import React from 'react';
import type { Metadata } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit as firestoreLimit } from 'firebase/firestore';

import { firebaseConfig } from '../../../src/firebase/config';
import { gitprofileConfig } from '../../../gitprofile.config';
import BlogClientPage from './BlogClientPage';

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

// This function can run on the server because it doesn't depend on client-side hooks.
// We initialize a temporary Firebase instance here for server-side rendering.
async function getBlogData(slug: string): Promise<Blog | null> {
    try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const firestore = getFirestore(app);
        const profileId = gitprofileConfig.github.username;

        const blogQuery = query(
          collection(firestore, `profiles/${profileId}/blogs`),
          where('slug', '==', decodeURIComponent(slug)),
          firestoreLimit(1)
        );
        const blogSnapshot = await getDocs(blogQuery);
        
        if (!blogSnapshot.empty) {
          const doc = blogSnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as Blog;
        }
    } catch (error) {
        console.error("Server-side fetch for blog failed:", error);
    }
    
    return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogData(params.slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }
  
  // Use the user's custom domain for canonical URLs.
  const blogUrl = `https://www.armankhan.me/blogs/${blog.slug}`;

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: blogUrl,
      images: [
        {
          url: blog.cover_image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: 'article',
      publishedTime: blog.date,
      authors: [gitprofileConfig.github.username],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: [blog.cover_image],
    },
  };
}

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogData(params.slug);
  return <BlogClientPage blog={blog} />;
}
