'use client';

import React, { useState } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Send, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactFormProps {
  profileId: string | null;
}

const inputClass = "w-full p-4 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
const textareaClass = `${inputClass} min-h-[140px]`;

export const ContactForm = ({ profileId }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const firestore = useFirestore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId || !firestore || status === 'submitting') return;

    setStatus('submitting');
    
    const messageData = {
      ...formData,
      profileId,
      ownerId: profileId, // For security rules
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    try {
      const messagesCollection = collection(firestore, `profiles/${profileId}/messages`);
      // This is a non-blocking call
      addDocumentNonBlocking(messagesCollection, messageData);
      
      // Assume success and give optimistic feedback
      setStatus('success');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="card p-6 md:p-8"
    >
        <h2 className="text-xl font-bold mb-6">Contact Me</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className={inputClass} required />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className={inputClass} required />
            </div>
            <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" className={inputClass} required />
            <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" className={textareaClass} required />

            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                    {status === 'submitting' && <Loader size={16} className="animate-spin" />}
                    {status === 'idle' && <Send size={16} />}
                    {status === 'success' && <CheckCircle size={16} />}
                    {status === 'error' && <span>Error!</span>}
                    <span className="ml-2">
                        {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Try Again' : 'Send Message'}
                    </span>
                </button>
            </div>
        </form>
    </motion.div>
  );
};
