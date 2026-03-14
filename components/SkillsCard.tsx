'use client';

import React from 'react';
import { gitprofileConfig } from '../gitprofile.config';
import { motion } from 'motion/react';

export const SkillsCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6"
    >
      <h2 className="text-xl font-bold mb-6">Tech Stack</h2>
      <div className="flex flex-wrap gap-2">
        {gitprofileConfig.skills.map((skill, index) => (
          <div 
            key={index} 
            className="px-3 py-1 bg-base-200 text-base-content/70 rounded-full text-sm font-medium border border-base-300"
          >
            {skill}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
