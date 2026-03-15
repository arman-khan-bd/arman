'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

const initialEducationState = {
    degree: '',
    institution: '',
    from: '',
    to: '',
};

const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

export default function ManageEducationPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newEducation, setNewEducation] = useState(initialEducationState);
  const [isAdding, setIsAdding] = useState(false);

  const educationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/educations`);
  }, [user, firestore]);

  const { data: educations, isLoading } = useCollection(educationsQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEducation.degree || !newEducation.institution || !educationsQuery || !user) return;

    setIsAdding(true);
    const educationData = {
      ...newEducation,
      profileId: user.uid,
      ownerId: user.uid,
    };
    
    try {
      await addDocumentNonBlocking(educationsQuery, educationData);
    } finally {
      setNewEducation(initialEducationState);
      setIsAdding(false);
    }
  };

  const handleDeleteEducation = (eduId: string) => {
    if (!user) return;
    const eduRef = doc(firestore, `profiles/${user.uid}/educations/${eduId}`);
    deleteDocumentNonBlocking(eduRef);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Education</h1>
      </div>

      <div className="card p-6 mb-6">
        <form onSubmit={handleAddEducation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="degree" value={newEducation.degree} onChange={handleInputChange} placeholder="Degree (e.g., B.Sc in Computer Science)" className={inputClass} required />
            <input type="text" name="institution" value={newEducation.institution} onChange={handleInputChange} placeholder="Institution Name" className={inputClass} required />
            <input type="text" name="from" value={newEducation.from} onChange={handleInputChange} placeholder="From Year (e.g., 2015)" className={inputClass} required />
            <input type="text" name="to" value={newEducation.to} onChange={handleInputChange} placeholder="To Year (e.g., 2019)" className={inputClass} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isAdding}>
            {isAdding ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
            <span>{isAdding ? 'Adding...' : 'Add Education'}</span>
          </button>
        </form>
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
                  <button onClick={() => handleDeleteEducation(edu.id)} className="btn btn-sm btn-error">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

    