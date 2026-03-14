'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'Luxury', value: 'luxury' },
];

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme !== currentTheme) {
      setCurrentTheme(savedTheme); // eslint-disable-line react-hooks/set-state-in-effect
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [currentTheme]);

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 bg-base-100 border border-base-300 rounded-xl shadow-xl p-2 min-w-[120px]"
          >
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => changeTheme(theme.value)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTheme === theme.value ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-primary text-primary-content shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        <Palette size={24} />
      </button>
    </div>
  );
};
