'use client';

import React, { useState, useEffect } from 'react';
import { Folder, Globe, Github, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, query, limit as firestoreLimit, orderBy, getDocs } from 'firebase/firestore';

interface Project {
  id: string;
  name: string;
  description: string;
  techStack?: string[];
  repoUrl?: string;
  liveUrl?: string;
}

interface ProjectsCardProps {
  limit?: number;
  showTitle?: boolean;
  showSeeAll?: boolean;
  profileId: string | null;
}

export const ProjectsCard = ({ 
  limit = 4, 
  showTitle = true,
  showSeeAll = true,
  profileId
}: ProjectsCardProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!profileId || !firestore) {
      setIsLoading(false);
      return;
    }
    
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectsQuery = query(collection(firestore, `profiles/${profileId}/projects`), orderBy('name'));
        const q = limit > 0 ? query(projectsQuery, firestoreLimit(limit)) : projectsQuery;
        
        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [profileId, firestore, limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(limit > 0 ? limit : 4)].map((_, i) => (
          <div key={i} className="card h-48 animate-pulse bg-base-300" />
        ))}
      </div>
    );
  }
  
  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-6">
      {(showTitle || showSeeAll) && (
        <div className="flex justify-between items-center">
          {showTitle && <h2 className="text-xl font-bold">My Projects</h2>}
          {showSeeAll && projects.length > 0 && limit !== 0 && (
            <Link 
              href="/projects" 
              className="text-primary text-sm font-medium hover:underline"
            >
              See All
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="card p-6 hover:shadow-md transition-all group border border-base-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Folder size={18} className="text-primary" />
                <Link 
                  href={`/projects/${encodeURIComponent(project.name)}`}
                  className="font-bold hover:text-primary transition-colors truncate"
                >
                  {project.name}
                </Link>
              </div>
              <p className="text-sm text-base-content/60 line-clamp-2 mb-4 h-10">
                {project.description || 'No description available'}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
               {project.techStack && project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 5).map(tech => (
                        <span key={tech} className="px-2 py-0.5 bg-base-200 rounded text-[10px] font-bold">
                            {tech}
                        </span>
                    ))}
                </div>
               )}

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-base-300">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-base-200 hover:bg-base-300 text-sm font-bold transition-colors"
                  >
                    <Globe size={16} />
                    <span>Live</span>
                  </a>
                ) : (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-base-200 hover:bg-base-300 text-sm font-bold transition-colors"
                  >
                    <Github size={16} />
                    <span>Source</span>
                  </a>
                )}
                <Link
                  href={`/projects/${encodeURIComponent(project.name)}`}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-content text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                >
                  <ArrowRight size={16} />
                  <span>Details</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
