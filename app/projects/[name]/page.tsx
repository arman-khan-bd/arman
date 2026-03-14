'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ArrowRightCircle, 
  ArrowLeft,
  Globe,
  ShoppingCart
} from 'lucide-react';
import Image from 'next/image';
import { getProjectDetails } from '@/data/projects';
import { OrderModal } from '@/components/OrderModal';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectName = params.name as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const project = useMemo(() => {
    if (!projectName) return null;
    return getProjectDetails(decodeURIComponent(projectName));
  }, [projectName]);

  if (!project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.screenshots.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
  };

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        projectName={project.name} 
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

              {/* Controls */}
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

              {/* Indicators */}
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
            </div>

            {/* Description */}
            <section className="card p-8 border border-base-300 bg-base-100">
              <h2 className="text-2xl font-bold mb-4">About the Project</h2>
              <p className="text-base-content/70 leading-relaxed">
                {project.longDescription}
              </p>
            </section>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Features */}
              <section className="card p-6 border border-base-300 bg-base-100">
                <div className="flex items-center gap-2 mb-4 text-green-500">
                  <CheckCircle2 size={20} />
                  <h3 className="font-bold">Current Features</h3>
                </div>
                <ul className="space-y-3">
                  {project.features.current.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-base-content/70">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Future Build */}
              <section className="card p-6 border border-base-300 bg-base-100">
                <div className="flex items-center gap-2 mb-4 text-blue-500">
                  <ArrowRightCircle size={20} />
                  <h3 className="font-bold">Future Build</h3>
                </div>
                <ul className="space-y-3">
                  {project.features.future.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-base-content/70">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Right Column: Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card p-6 border border-base-300 bg-base-100 space-y-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/50 uppercase font-bold tracking-wider">Build Time</p>
                    <p className="font-bold">{project.daysToBuild} Days</p>
                  </div>
                </div>

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
                <a 
                  href="#" 
                  target="_blank"
                  className="w-full py-4 bg-base-200 hover:bg-base-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Globe size={18} />
                  <span>Live Preview</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
