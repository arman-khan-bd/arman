'use client';

import React, { useEffect, useState } from 'react';
import { ProjectsCard } from '../../components/ProjectsCard';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs, limit as firestoreLimit } from 'firebase/firestore';

export default function AllProjectsPage() {
  const [profileId, setProfileId] = useState<string | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (firestore) {
        const profilesCollection = collection(firestore, 'profiles');
        const q = query(profilesCollection, firestoreLimit(1));
        const profileSnapshot = await getDocs(q);
        if (!profileSnapshot.empty) {
          setProfileId(profileSnapshot.docs[0].id);
        }
      }
    };
    fetchProfile();
  }, [firestore]);
  
  return (
    <div className="min-h-screen bg-base-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-lg font-bold">All Projects</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProjectsCard 
            limit={0} // 0 means no limit (show all)
            showTitle={false} 
            showSeeAll={false}
            profileId={profileId}
          />
        </motion.div>
      </main>
    </div>
  );
}
