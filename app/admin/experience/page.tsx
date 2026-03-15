'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { gitprofileConfig } from '../../../gitprofile.config';

const initialExperienceState = {
    role: '',
    companyName: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
};

const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

export default function ManageExperiencePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newExperience, setNewExperience] = useState(initialExperienceState);
  const [isAdding, setIsAdding] = useState(false);
  const profileId = gitprofileConfig.github.username;

  const experiencesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, `profiles/${profileId}/workExperiences`);
  }, [firestore, profileId]);

  const { data: experiences, isLoading } = useCollection(experiencesQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExperience.role || !newExperience.companyName || !experiencesQuery || !user) return;

    setIsAdding(true);
    const experienceData = {
      ...newExperience,
      endDate: newExperience.isCurrent ? 'Present' : newExperience.endDate,
      profileId: profileId,
      ownerId: user.uid,
    };
    
    try {
      await addDocumentNonBlocking(experiencesQuery, experienceData);
    } finally {
      setNewExperience(initialExperienceState);
      setIsAdding(false);
    }
  };

  const handleDeleteExperience = (expId: string) => {
    if (!firestore) return;
    const expRef = doc(firestore, `profiles/${profileId}/workExperiences/${expId}`);
    deleteDocumentNonBlocking(expRef);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Experience</h1>
      </div>

      <div className="card p-6 mb-6">
        <form onSubmit={handleAddExperience} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="role" value={newExperience.role} onChange={handleInputChange} placeholder="Role (e.g., Full Stack Developer)" className={inputClass} required />
            <input type="text" name="companyName" value={newExperience.companyName} onChange={handleInputChange} placeholder="Company Name" className={inputClass} required />
            <input type="text" name="startDate" value={newExperience.startDate} onChange={handleInputChange} placeholder="Start Date (e.g., 2021)" className={inputClass} required />
            <input type="text" name="endDate" value={newExperience.endDate} onChange={handleInputChange} placeholder="End Date (e.g., 2023)" className={inputClass} disabled={newExperience.isCurrent} />
          </div>
           <div className="flex items-center gap-2">
            <input type="checkbox" id="isCurrent" name="isCurrent" checked={newExperience.isCurrent} onChange={handleInputChange} className="checkbox checkbox-primary" />
            <label htmlFor="isCurrent" className="text-sm cursor-pointer">I currently work here</label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isAdding}>
            {isAdding ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
            <span>{isAdding ? 'Adding...' : 'Add Experience'}</span>
          </button>
        </form>
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
                  <button onClick={() => handleDeleteExperience(exp.id)} className="btn btn-sm btn-error">
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
