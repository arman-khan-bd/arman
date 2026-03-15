'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

export default function ManageSkillsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const skillsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, `profiles/${user.uid}/skills`);
  }, [user, firestore]);

  const { data: skills, isLoading } = useCollection(skillsQuery);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !skillsQuery || !user) return;

    setIsAdding(true);
    const skillData = {
      name: newSkill,
      profileId: user.uid,
      ownerId: user.uid,
    };
    
    try {
      await addDocumentNonBlocking(skillsQuery, skillData);
    } finally {
      setNewSkill('');
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = (skillId: string) => {
    if (!user) return;
    const skillRef = doc(firestore, `profiles/${user.uid}/skills/${skillId}`);
    deleteDocumentNonBlocking(skillRef);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Tech Stack</h1>
      </div>

      {/* Add Skill Form */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleAddSkill} className="flex gap-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a new skill (e.g., React.js)"
            className="flex-grow p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            required
          />
          <button type="submit" className="btn btn-primary" disabled={isAdding || !newSkill.trim()}>
            {isAdding ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
            <span>{isAdding ? 'Adding...' : 'Add Skill'}</span>
          </button>
        </form>
      </div>

      {/* Skills List */}
      <div className="card p-6">
        {isLoading && (
           <div className="flex justify-center items-center">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
        {!isLoading && (!skills || skills.length === 0) && (
          <p className="text-base-content/60">No skills found. Add one to get started.</p>
        )}
        {!isLoading && skills && skills.length > 0 && (
          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.id} className="p-4 rounded-lg bg-base-200 flex justify-between items-center">
                <h3 className="font-bold">{skill.name}</h3>
                <button onClick={() => handleDeleteSkill(skill.id)} className="btn btn-sm btn-error">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
