'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trash2, Globe } from 'lucide-react';
import Image from 'next/image';

interface Visitor {
  id: string;
  ip: string;
  city: string;
  regionName: string;
  country: string;
  countryCode: string;
  timestamp: string;
  isp: string;
}

export default function ManageVisitorsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      if (!user || !firestore) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const visitorsQuery = query(collection(firestore, `profiles/${user.uid}/visitors`), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(visitorsQuery);
        const visitorsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Visitor[];
        setVisitors(visitorsData);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && firestore) {
      fetchVisitors();
    }
  }, [user, firestore]);

  const handleDelete = (visitorId: string) => {
    if (!user) return;
    const visitorRef = doc(firestore, `profiles/${user.uid}/visitors/${visitorId}`);
    deleteDocumentNonBlocking(visitorRef);
    // Optimistically update the UI
    setVisitors(prevVisitors => prevVisitors.filter(visitor => visitor.id !== visitorId));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Visitors</h1>
      <div className="card p-6">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!isLoading && (!visitors || visitors.length === 0) && (
          <div className="text-center py-8">
            <Globe className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-sm font-medium text-base-content">No visitors yet</h3>
            <p className="mt-1 text-sm text-base-content/60">Visitor data from your main site will appear here.</p>
          </div>
        )}
        {!isLoading && visitors && visitors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Location</th>
                  <th>IP Address</th>
                  <th>ISP</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(visitor => (
                  <tr key={visitor.id} className="hover">
                    <td className="w-12">
                      {visitor.countryCode && (
                        <Image 
                          src={`https://flagcdn.com/w40/${visitor.countryCode.toLowerCase()}.png`}
                          alt={`${visitor.country} flag`}
                          width={32}
                          height={20}
                          className="rounded-sm"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </td>
                    <td>
                      <div className="font-bold">{visitor.city || 'Unknown City'}</div>
                      <div className="text-sm opacity-50">{visitor.regionName}, {visitor.country}</div>
                    </td>
                    <td>{visitor.ip}</td>
                    <td>{visitor.isp}</td>
                    <td>{format(new Date(visitor.timestamp), 'MMM dd, yyyy, hh:mm a')}</td>
                    <td>
                      <button onClick={() => handleDelete(visitor.id)} className="btn btn-sm btn-error">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
