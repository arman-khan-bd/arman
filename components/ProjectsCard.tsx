'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Folder, Globe, Github, ArrowRight, Loader2 } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { collection, query, limit as firestoreLimit, orderBy, getDocs, startAfter, DocumentSnapshot } from 'firebase/firestore';

interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  techStack?: string[];
  repoUrl?: string;
  liveUrl?: string;
  screenshots?: string[];
}

interface ProjectsCardProps {
  limit?: number;
  showTitle?: boolean;
  showSeeAll?: boolean;
  profileId: string | null;
  listView?: boolean;
}

export const ProjectsCard = ({ 
  limit = 4, 
  showTitle = true,
  showSeeAll = true,
  profileId,
  listView = false,
}: ProjectsCardProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const firestore = useFirestore();

  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { once: false, margin: "200px" });

  const fetchProjects = useCallback(async (loadMore = false) => {
    if (!profileId || !firestore) {
      setIsLoading(false);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    try {
      const projectsCollection = collection(firestore, `profiles/${profileId}/projects`);
      let q = query(projectsCollection, orderBy('name'));

      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const currentLimit = (limit === 0 && listView) ? 10 : limit;
      q = query(q, firestoreLimit(currentLimit));

      const snapshot = await getDocs(q);
      const newProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      
      setProjects(prev => loadMore ? [...prev, ...newProjects] : newProjects);
      
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastDoc || null);

      if (snapshot.docs.length < currentLimit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [profileId, firestore, lastVisible, limit, listView]);

  useEffect(() => {
    setProjects([]);
    setLastVisible(null);
    setHasMore(true);
    fetchProjects(false);
  }, [profileId]);

  useEffect(() => {
    if (isInView && hasMore && !isLoading && listView) {
      fetchProjects(true);
    }
  }, [isInView, hasMore, isLoading, listView, fetchProjects]);

  if (isLoading && projects.length === 0) {
    const skeletonCount = (limit === 0 || limit > 4) ? 4 : limit;
    const skeletonClass = listView ? "card h-48 animate-pulse bg-base-300" : "card h-48 animate-pulse bg-base-300";
    return (
      <div className={listView ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {[...Array(skeletonCount)].map((_, i) => <div key={i} className={skeletonClass} />)}
      </div>
    );
  }

  if (!projects || projects.length === 0) return null;

  // LIST VIEW
  if (listView) {
    return (
      <div className="space-y-6">
        <div className="space-y-8">
          {projects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href={`/projects/${encodeURIComponent(project.name)}`}
                className="card flex flex-col md:flex-row items-center gap-8 p-6 hover:shadow-lg transition-shadow duration-300 group bg-base-100"
              >
                <div className="w-full md:w-1/3 aspect-video relative rounded-lg overflow-hidden shrink-0 bg-base-200">
                  {project.screenshots && project.screenshots.length > 0 ? (
                    <Image
                      src={project.screenshots[0]}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder size={40} className="text-base-content/20"/>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-base-content/70 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 5).map(tech => (
                            <span key={tech} className="px-2 py-1 bg-base-200 rounded text-xs font-semibold">
                                {tech}
                            </span>
                        ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center items-center py-8">
            {isLoading && <Loader2 size={32} className="animate-spin text-primary" />}
          </div>
        )}
      </div>
    );
  }

  // GRID VIEW (Default)
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
            className="card p-6 hover:shadow-md transition-all group border border-base-300 flex flex-col justify-between bg-base-100"
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
                {project.repoUrl && !project.liveUrl ? ( // Only show source if no live url
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-2 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-base-200 hover:bg-base-300 text-sm font-bold transition-colors"
                  >
                    <Github size={16} />
                    <span>Source</span>
                  </a>
                ) : (
                  <>
                    <a
                      href={project.liveUrl || project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-base-200 hover:bg-base-300 text-sm font-bold transition-colors"
                    >
                      {project.liveUrl ? <Globe size={16} /> : <Github size={16} />}
                      <span>{project.liveUrl ? 'Live' : 'Source'}</span>
                    </a>
                     <Link
                        href={`/projects/${encodeURIComponent(project.name)}`}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-content text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                      >
                        <ArrowRight size={16} />
                        <span>Details</span>
                      </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
