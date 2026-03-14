import React from 'react';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { 
  Users,
  ShoppingCart,
  Newspaper,
  FolderKanban,
  MessageSquare,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Visitors', value: '1,234', icon: Users, change: '+5.2%' },
    { title: 'Orders', value: '56', icon: ShoppingCart, change: '+2' },
    { title: 'Blog Posts', value: '6', icon: Newspaper, change: '' },
    { title: 'Projects', value: '8', icon: FolderKanban, change: '' },
    { title: 'Comments', value: '28', icon: MessageSquare, change: '+4' },
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
