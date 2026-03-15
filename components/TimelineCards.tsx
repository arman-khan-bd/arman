'use client';

import React, { useEffect, useState } from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { motion } from 'motion/react';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';

interface Experience {
    id: string;
    role: string;
    companyName: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    from: string;
    to: string;
}

export const ExperienceCard = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchExperiences = async () => {
            setLoading(true);
            try {
                if (firestore) {
                    const profilesCollection = collection(firestore, 'profiles');
                    const profileQuery = query(profilesCollection, limit(1));
                    const profileSnapshot = await getDocs(profileQuery);

                    if (!profileSnapshot.empty) {
                        const profileDoc = profileSnapshot.docs[0];
                        const expCollection = collection(firestore, `profiles/${profileDoc.id}/workExperiences`);
                        const expQuery = query(expCollection, orderBy('startDate', 'desc'));
                        const expSnapshot = await getDocs(expQuery);
                        const expData = expSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Experience[];
                        setExperiences(expData);
                    } else {
                         setExperiences(gitprofileConfig.experiences.map((exp, i) => ({
                            id: `static-${i}`,
                            role: exp.position,
                            companyName: exp.company,
                            startDate: exp.from,
                            endDate: exp.to,
                            isCurrent: exp.to.toLowerCase() === 'present',
                        })));
                    }
                } else {
                     setExperiences(gitprofileConfig.experiences.map((exp, i) => ({
                        id: `static-${i}`,
                        role: exp.position,
                        companyName: exp.company,
                        startDate: exp.from,
                        endDate: exp.to,
                        isCurrent: exp.to.toLowerCase() === 'present',
                    })));
                }
            } catch (error) {
                console.error("Error fetching experiences:", error);
                 setExperiences(gitprofileConfig.experiences.map((exp, i) => ({
                    id: `static-${i}`,
                    role: exp.position,
                    companyName: exp.company,
                    startDate: exp.from,
                    endDate: exp.to,
                    isCurrent: exp.to.toLowerCase() === 'present',
                })));
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, [firestore]);

    if (loading) {
        return <div className="card p-6 h-40 animate-pulse bg-base-300" />;
    }

    if (experiences.length === 0) {
        return null;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6"
        >
            <h2 className="text-xl font-bold mb-6">Experience</h2>
            <div className="space-y-8">
                {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-primary before:rounded-full before:z-10 after:content-[''] after:absolute after:left-[5px] after:top-2 after:w-[2px] after:h-[calc(100%+2rem)] after:bg-base-300 last:after:hidden">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                            <h3 className="font-bold text-lg">{exp.role}</h3>
                            <span className="text-sm text-base-content/50 font-medium">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-primary font-medium block mb-2">{exp.companyName}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export const EducationCard = () => {
    const [educations, setEducations] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchEducations = async () => {
            setLoading(true);
            try {
                if (firestore) {
                    const profilesCollection = collection(firestore, 'profiles');
                    const profileQuery = query(profilesCollection, limit(1));
                    const profileSnapshot = await getDocs(profileQuery);

                    if (!profileSnapshot.empty) {
                        const profileDoc = profileSnapshot.docs[0];
                        const eduCollection = collection(firestore, `profiles/${profileDoc.id}/educations`);
                        const eduQuery = query(eduCollection, orderBy('from', 'desc'));
                        const eduSnapshot = await getDocs(eduQuery);
                        const eduData = eduSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Education[];
                        setEducations(eduData);
                    } else {
                        setEducations(gitprofileConfig.educations as Education[]);
                    }
                } else {
                    setEducations(gitprofileConfig.educations as Education[]);
                }
            } catch (error) {
                console.error("Error fetching educations:", error);
                setEducations(gitprofileConfig.educations as Education[]);
            } finally {
                setLoading(false);
            }
        };

        fetchEducations();
    }, [firestore]);

    if (loading) {
        return <div className="card p-6 h-40 animate-pulse bg-base-300 mt-4" />;
    }

    if (educations.length === 0) {
        return null;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6"
        >
            <h2 className="text-xl font-bold mb-6">Education</h2>
            <div className="space-y-8">
                {educations.map((edu, index) => (
                    <div key={edu.id || index} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-secondary before:rounded-full before:z-10 after:content-[''] after:absolute after:left-[5px] after:top-2 after:w-[2px] after:h-[calc(100%+2rem)] after:bg-base-300 last:after:hidden">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                            <h3 className="font-bold text-lg">{edu.degree}</h3>
                            <span className="text-sm text-base-content/50 font-medium">{edu.from} - {edu.to}</span>
                        </div>
                        <p className="text-base-content/70 font-medium">{edu.institution}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
