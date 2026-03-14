'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { AnimatePresence, motion } from 'motion/react';
import { gitprofileConfig } from '../../gitprofile.config';

export const MobileAdminHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden sticky top-0 z-50">
            <div className="bg-base-100/80 backdrop-blur-md border-b border-base-300 h-16 flex items-center justify-between px-4">
                 <div>
                    <h2 className="text-lg font-bold text-primary">Arman's Portfolio</h2>
                    <p className="text-xs text-base-content/60 -mt-1">Admin Panel</p>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2">
                    <Menu />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50"
                    >
                        <div className="w-64 h-full bg-base-100 shadow-xl">
                            <AdminSidebar />
                        </div>
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white p-2">
                            <X />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
             {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40"
                />
            )}
        </div>
    );
};
