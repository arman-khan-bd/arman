'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { motion } from 'motion/react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit as firestoreLimit } from 'firebase/firestore';

interface Skill {
    id: string;
    name: string;
}

export const SkillsCard = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchSkills = async () => {
            setLoading(true);
            try {
                if (firestore) {
                    const profilesCollection = collection(firestore, 'profiles');
                    const q = query(profilesCollection, where('githubUsername', '==', gitprofileConfig.github.username), firestoreLimit(1));
                    const profileSnapshot = await getDocs(q);

                    if (!profileSnapshot.empty) {
                        const profileDoc = profileSnapshot.docs[0];
                        const skillsCollection = collection(firestore, `profiles/${profileDoc.id}/skills`);
                        const skillsSnapshot = await getDocs(skillsCollection);
                        const skillsData = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
                        setSkills(skillsData);
                    } else {
                        setSkills(gitprofileConfig.skills.map(name => ({ id: name, name })));
                    }
                } else {
                    setSkills(gitprofileConfig.skills.map(name => ({ id: name, name })));
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
                setSkills(gitprofileConfig.skills.map(name => ({ id: name, name })));
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, [firestore]);


    if (loading) {
        return <div className="card p-6 h-40 animate-pulse bg-base-300" />;
    }

    if (skills.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6"
        >
            <h2 className="text-xl font-bold mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <div
                        key={skill.id || index}
                        className="px-3 py-1 bg-base-200 text-base-content/70 rounded-full text-sm font-medium border border-base-300"
                    >
                        {skill.name}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
