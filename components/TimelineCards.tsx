'use client';

import React from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { motion } from 'motion/react';

export const ExperienceCard = () => {
  if (!gitprofileConfig.experiences || gitprofileConfig.experiences.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6"
    >
      <h2 className="text-xl font-bold mb-6">Experience</h2>
      <div className="space-y-8">
        {gitprofileConfig.experiences.map((exp, index) => (
          <div key={index} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-primary before:rounded-full before:z-10 after:content-[''] after:absolute after:left-[5px] after:top-2 after:w-[2px] after:h-[calc(100%+2rem)] after:bg-base-300 last:after:hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <h3 className="font-bold text-lg">{exp.position}</h3>
              <span className="text-sm text-base-content/50 font-medium">{exp.from} - {exp.to}</span>
            </div>
            <a 
              href={exp.companyLink} 
              target="_blank" 
              rel="noreferrer" 
              className="text-primary font-medium hover:underline block mb-2"
            >
              {exp.company}
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const EducationCard = () => {
  if (!gitprofileConfig.educations || gitprofileConfig.educations.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6"
    >
      <h2 className="text-xl font-bold mb-6">Education</h2>
      <div className="space-y-8">
        {gitprofileConfig.educations.map((edu, index) => (
          <div key={index} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-secondary before:rounded-full before:z-10 after:content-[''] after:absolute after:left-[5px] after:top-2 after:w-[2px] after:h-[calc(100%+2rem)] after:bg-base-300 last:after:hidden">
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
