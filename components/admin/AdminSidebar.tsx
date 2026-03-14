'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  User,
  Wrench,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Newspaper,
  ShoppingCart,
  MessageSquare,
  Users,
  Settings,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../src/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/settings', icon: Settings, label: 'General Settings' },
  { href: '/admin/skills', icon: Wrench, label: 'Tech Stack' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/education', icon: GraduationCap, label: 'Education' },
  { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/blogs', icon: Newspaper, label: 'Blogs' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { href: '/admin/messages', icon: User, label: 'Messages' }, // Using User icon as placeholder
  { href: '/admin/visitors', icon: Users, label: 'Visitors' },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="h-screen bg-base-100 border-r border-base-300 flex flex-col sticky top-0">
      <div className="p-6 text-center border-b border-base-300">
        <h2 className="text-xl font-bold text-primary">Arman's Portfolio</h2>
        <p className="text-xs text-base-content/60">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-primary text-primary-content'
                : 'hover:bg-base-200'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-base-300 mt-auto space-y-2">
         <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-base-200 text-base-content/70"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <Link href="/" className="flex items-center justify-center gap-2 text-sm font-bold text-base-content/60 hover:text-primary transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Site</span>
        </Link>
      </div>
    </div>
  );
};
