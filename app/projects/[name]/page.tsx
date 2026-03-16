import React from 'react';
import type { Metadata } from 'next';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit as firestoreLimit } from 'firebase/firestore';

import { firebaseConfig } from '../../../src/firebase/config';
import { gitprofileConfig } from '../../../gitprofile.config';
import ProjectClientPage from './ProjectClientPage';
import type { ProjectDetail } from '../../../data/projects';

// This function can run on the server because it doesn't depend on client-side hooks.
// We initialize a temporary Firebase instance here for server-side rendering.
async function getProjectData(name: string): Promise<ProjectDetail | null> {
    try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const firestore = getFirestore(app);
        const profileId = gitprofileConfig.github.username;

        const projectQuery = query(
          collection(firestore, `profiles/${profileId}/projects`),
          where('name', '==', decodeURIComponent(name)),
          firestoreLimit(1)
        );
        const projectSnapshot = await getDocs(projectQuery);
        
        if (!projectSnapshot.empty) {
          const doc = projectSnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as ProjectDetail;
        }
    } catch (error) {
        console.error("Server-side fetch for project failed:", error);
    }
    
    return null;
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const project = await getProjectData(params.name);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The project you are looking for does not exist.',
    };
  }
  
  // Use the user's custom domain for canonical URLs.
  const projectUrl = `https://www.armankhan.me/projects/${encodeURIComponent(project.name)}`;
  const imageUrl = project.screenshots && project.screenshots.length > 0 ? project.screenshots[0] : '';

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      url: projectUrl,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProjectDetailsPage({ params }: { params: { name: string } }) {
  const project = await getProjectData(params.name);
  return <ProjectClientPage project={project} />;
}
