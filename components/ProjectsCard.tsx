'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { Star, GitFork, Folder, ExternalLink, ShoppingCart, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { OrderModal } from './OrderModal';

import Link from 'next/link';

interface Repo {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  language: string;
  fork: boolean;
  updated_at: string;
}

interface ProjectsCardProps {
  limit?: number;
  showTitle?: boolean;
  showSeeAll?: boolean;
}

export const ProjectsCard = ({ 
  limit = gitprofileConfig.github.limit, 
  showTitle = true,
  showSeeAll = true 
}: ProjectsCardProps) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${gitprofileConfig.github.username}/repos?per_page=100`
        );
        if (!response.ok) {
          console.error('Error fetching GitHub repos data:', response.status, response.statusText);
          return;
        }
        let data: Repo[] = await response.json();

        if (gitprofileConfig.github.exclude.forks) {
          data = data.filter((repo) => !repo.fork);
        }

        if (gitprofileConfig.github.exclude.projects.length > 0) {
          data = data.filter(
            (repo) => !gitprofileConfig.github.exclude.projects.includes(repo.name)
          );
        }

        data.sort((a, b) => {
          if (gitprofileConfig.github.sortBy === 'stars') {
            return b.stargazers_count - a.stargazers_count;
          } else {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          }
        });

        if (limit) {
          setRepos(data.slice(0, limit));
        } else {
          setRepos(data);
        }
      } catch (error) {
        console.error('Error fetching repos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(limit || 4)].map((_, i) => (
          <div key={i} className="card h-48 animate-pulse bg-base-300" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        projectName={selectedProject || ''} 
      />
      {(showTitle || showSeeAll) && (
        <div className="flex justify-between items-center">
          {showTitle && <h2 className="text-xl font-bold">My Projects</h2>}
          {showSeeAll && (
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
        {repos.map((repo, index) => (
          <motion.div
            key={repo.id}
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
                  href={`/projects/${encodeURIComponent(repo.name)}`}
                  className="font-bold hover:text-primary transition-colors truncate"
                >
                  {repo.name}
                </Link>
              </div>
              <p className="text-sm text-base-content/60 line-clamp-2 mb-4 h-10">
                {repo.description || 'No description available'}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-xs font-medium text-base-content/50">
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={14} />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                    <span className="text-xs font-medium text-base-content/70">{repo.language}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-base-300">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-base-200 hover:bg-base-300 text-sm font-bold transition-colors"
                >
                  <Globe size={16} />
                  <span>Live</span>
                </a>
                <button
                  onClick={() => setSelectedProject(repo.name)}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-primary-content text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                >
                  <ShoppingCart size={16} />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
