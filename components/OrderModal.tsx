'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export const OrderModal = ({ isOpen, onClose, projectName }: OrderModalProps) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderData = {
      projectName,
      type: isCustomizing ? 'Customized' : 'As is',
      description: isCustomizing ? description : 'No customization requested',
      fullName,
      email,
      phone,
      isUrgent,
      timestamp: new Date().toISOString(),
    };

    console.log('Order Submitted:', orderData);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after a delay and close
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset fields
      setIsCustomizing(false);
      setDescription('');
      setFullName('');
      setEmail('');
      setPhone('');
      setIsUrgent(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-base-300 flex justify-between items-center bg-base-100">
              <div>
                <h3 className="text-xl font-bold">Order Project</h3>
                <p className="text-sm text-base-content/60">{projectName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-base-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Order Received!</h4>
                  <p className="text-base-content/60">
                    Thank you for your order. I will contact you soon via WhatsApp or Email.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Design Choice Toggle */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold block">Design Choice</label>
                    <div className="flex p-1 bg-base-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setIsCustomizing(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                          !isCustomizing
                            ? 'bg-base-100 shadow-sm text-primary'
                            : 'text-base-content/60 hover:text-base-content'
                        }`}
                      >
                        I want this design
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomizing(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                          isCustomizing
                            ? 'bg-base-100 shadow-sm text-primary'
                            : 'text-base-content/60 hover:text-base-content'
                        }`}
                      >
                        I want to customize
                      </button>
                    </div>
                  </div>

                  {/* Customization Description */}
                  <AnimatePresence mode="wait">
                    {isCustomizing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-bold block">Customization Details</label>
                          <textarea
                            required={isCustomizing}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe how you want to customize this project..."
                            className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Full Name</label>
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Email Address</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold block">Phone (WhatsApp)</label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 234 567 890"
                        className="w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Urgency Toggle */}
                  <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isUrgent ? 'bg-orange-500/20 text-orange-500' : 'bg-base-300 text-base-content/40'}`}>
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Is this urgent?</p>
                        <p className="text-xs text-base-content/50">Priority handling for your order</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUrgent(!isUrgent)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                        isUrgent ? 'bg-primary' : 'bg-base-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          isUrgent ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary text-primary-content rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Order</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
