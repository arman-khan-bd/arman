'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { motion } from 'motion/react';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

interface Skill {
    id: string;
    name: string;
}

interface SkillsCardProps {
    profileId: string | null;
}

export const SkillsCard = ({ profileId }: SkillsCardProps) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchSkills = async () => {
            setLoading(true);
            try {
                if (firestore && profileId) {
                    const skillsCollection = collection(firestore, `profiles/${profileId}/skills`);
                    const skillsSnapshot = await getDocs(skillsCollection);
                    const skillsData = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Skill[];
                    
                    if (skillsData.length > 0) {
                        setSkills(skillsData);
                    } else {
                        // Fallback to static data if no skills in DB for this profile
                        setSkills(gitprofileConfig.skills.map(name => ({ id: name, name })));
                    }
                } else {
                    // Fallback for when firestore or profileId is not ready, or for static use
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
    }, [firestore, profileId]);


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
