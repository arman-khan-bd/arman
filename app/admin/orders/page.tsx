'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trash2, ShoppingCart, AlertTriangle, Mail, Phone } from 'lucide-react';

interface Order {
  id: string;
  projectName: string;
  fullName: string;
  email: string;
  phone: string;
  isCustom: boolean;
  description: string;
  isUrgent: boolean;
  createdAt: string;
}

export default function ManageOrdersPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `profiles/${user.uid}/orders`), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const handleDelete = (orderId: string) => {
    if (!user) return;
    const orderRef = doc(firestore, `profiles/${user.uid}/orders/${orderId}`);
    deleteDocumentNonBlocking(orderRef);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="card p-6">
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!isLoading && (!orders || orders.length === 0) && (
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-sm font-medium text-base-content">No orders</h3>
            <p className="mt-1 text-sm text-base-content/60">New project orders will appear here.</p>
          </div>
        )}
        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="p-4 rounded-lg bg-base-200">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{order.projectName}</h3>
                      {order.isUrgent && <div className="badge badge-error gap-1"><AlertTriangle size={12}/> Urgent</div>}
                      {order.isCustom && <div className="badge badge-info">Customized</div>}
                    </div>

                    <p className="text-sm text-base-content/70 italic mb-3">"{order.description}"</p>
                    
                    <div className="text-xs text-base-content/60">
                        <p><span className="font-semibold">Client:</span> {order.fullName}</p>
                        <p><span className="font-semibold">Contact:</span> {order.email} | {order.phone}</p>
                        <p><span className="font-semibold">Ordered on:</span> {format(new Date(order.createdAt), 'MMM dd, yyyy, hh:mm a')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={`mailto:${order.email}`} className="btn btn-sm btn-ghost">
                      <Mail size={16} /> Email
                    </a>
                    <a href={`tel:${order.phone}`} className="btn btn-sm btn-ghost">
                      <Phone size={16} /> Call
                    </a>
                    <button onClick={() => handleDelete(order.id)} className="btn btn-sm btn-error">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
