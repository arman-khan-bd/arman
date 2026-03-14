'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function ManageExperiencePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const experiencesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/workExperiences`);
  }, [user, firestore]);

  const { data: experiences, isLoading } = useCollection(experiencesQuery);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Experience</h1>
        <button className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>
      <div className="card p-6">
        {isLoading && (
           <div className="flex justify-center items-center">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
        {!isLoading && (!experiences || experiences.length === 0) && (
          <p className="text-base-content/60">No experience entries found.</p>
        )}
        {!isLoading && experiences && experiences.length > 0 && (
          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{exp.role}</h3>
                  <p className="text-sm text-base-content/60">{exp.companyName} ({exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate})</p>
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
    