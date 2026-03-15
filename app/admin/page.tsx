'use client';

import React from 'react';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { 
  Users,
  ShoppingCart,
  Newspaper,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function AdminDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const blogsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/blogs`);
  }, [user, firestore]);
  const { data: blogs } = useCollection(blogsQuery);

  const experiencesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/workExperiences`);
  }, [user, firestore]);
  const { data: experiences } = useCollection(experiencesQuery);

  const educationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/educations`);
  }, [user, firestore]);
  const { data: educations } = useCollection(educationsQuery);

  const stats = [
    { title: 'Visitors', value: '1,234', icon: Users, change: '+5.2%' },
    { title: 'Orders', value: '56', icon: ShoppingCart, change: '+2' },
    { title: 'Blog Posts', value: (blogs?.length ?? 0).toString(), icon: Newspaper, change: '' },
    { title: 'Experience', value: (experiences?.length ?? 0).toString(), icon: Briefcase, change: '' },
    { title: 'Education', value: (educations?.length ?? 0).toString(), icon: GraduationCap, change: '' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map(stat => (
          <DashboardCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="card p-6">
          <p className="text-base-content/60">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
}
    