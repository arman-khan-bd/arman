'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers,
  ArrowLeft,
  Globe,
  ShoppingCart,
  Github,
  ServerCrash
} from 'lucide-react';
import Image from 'next/image';
import { OrderModal } from '../../../components/OrderModal';
import type { ProjectDetail } from '../../../data/projects';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { gitprofileConfig } from '../../../gitprofile.config';

export default function ProjectClientPage({ project }: { project: ProjectDetail | null }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const profileId = gitprofileConfig.github.username;

  const nextImage = () => {
    if (!project || !project.screenshots || project.screenshots.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % project.screenshots.length);
  };

  const prevImage = () => {
    if (!project || !project.screenshots || project.screenshots.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <ServerCrash size={64} className="text-primary mb-4" />
        <h1 className="text-3xl font-bold">Project Not Found</h1>
        <p className="text-base-content/60 mt-2">
          The project you're looking for doesn't seem to exist.
        </p>
        <button 
            onClick={() => router.back()}
            className="mt-8 flex items-center gap-2 text-sm font-bold btn btn-primary"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        projectName={project.name} 
        profileId={profileId}
      />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-bold truncate max-w-[200px] md:max-w-none">{project.name}</h1>
          <div className="w-10 md:w-20" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Carousel & Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carousel */}
             {project.screenshots && project.screenshots.length > 0 && (
              <div className="relative aspect-video bg-base-300 rounded-2xl overflow-hidden group shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.screenshots[currentImageIndex]}
                      alt={`${project.name} screenshot ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </AnimatePresence>

                {project.screenshots.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={prevImage}
                        className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.screenshots.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}


            {/* Description */}
            <section className="card p-8 border border-base-300 bg-base-100">
              <h2 className="text-2xl font-bold mb-4">About the Project</h2>
              <article className="prose lg:prose-xl max-w-none prose-h1:text-primary prose-headings:font-bold prose-a:text-primary hover:prose-a:underline">
                 <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{project.longDescription || project.description}</ReactMarkdown>
              </article>
            </section>
          </div>

          {/* Right Column: Stats & Actions */}
          <div className="space-y-6">
            <div className="card p-6 border border-base-300 bg-base-100 space-y-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                    <Layers size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Tech Stack</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-base-200 rounded text-[10px] font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-base-300 space-y-3">
                <button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-4 bg-primary text-primary-content rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                  <ShoppingCart size={18} />
                  <span>Order Now</span>
                </button>
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 bg-base-200 hover:bg-base-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Globe size={18} />
                    <span>Live Preview</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a 
                    href={project.repoUrl} 
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 bg-base-200 hover:bg-base-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Github size={18} />
                    <span>View Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
