'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function ManageEducationPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const educationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/educations`);
  }, [user, firestore]);

  const { data: educations, isLoading } = useCollection(educationsQuery);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Education</h1>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>
      <div className="card p-6">
        {isLoading && (
           <div className="flex justify-center items-center">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
        {!isLoading && (!educations || educations.length === 0) && (
          <p className="text-base-content/60">No education entries found.</p>
        )}
        {!isLoading && educations && educations.length > 0 && (
           <div className="space-y-4">
            {educations.map(edu => (
              <div key={edu.id} className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-base-content/60">{edu.institution} ({edu.from} - {edu.to})</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm">Edit</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

    