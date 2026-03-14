import React from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { MobileAdminHeader } from '../../components/admin/MobileAdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="hidden lg:block lg:col-span-1">
          <AdminSidebar />
        </div>
        <div className="lg:col-span-4">
          <MobileAdminHeader />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
