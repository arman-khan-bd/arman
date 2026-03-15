'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

interface Comment {
  id: string;
  fullName: string;
  text: string;
  createdAt: string; // ISO String
}

interface CommentSectionProps {
  profileId: string;
  blogId: string;
  blogSlug: string;
}

export const CommentSection = ({ profileId, blogId, blogSlug }: CommentSectionProps) => {
  const firestore = useFirestore();
  const [newComment, setNewComment] = useState({ fullName: '', email: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsQuery = useMemoFirebase(() => {
    if (!profileId || !blogId) return null;
    return query(
      collection(firestore, `profiles/${profileId}/blogs/${blogId}/comments`),
      orderBy('createdAt', 'desc')
    );
  }, [profileId, blogId, firestore]);

  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.text.trim() || !newComment.fullName.trim() || !profileId || !firestore) return;
    
    setIsSubmitting(true);
    const commentData = {
      ...newComment,
      profileId,
      blogId,
      blogSlug,
      createdAt: new Date().toISOString(),
      ownerId: profileId, // for rules
    };

    const commentsCollection = collection(firestore, `profiles/${profileId}/blogs/${blogId}/comments`);
    
    try {
      // Not awaiting to keep UI non-blocking
      addDocumentNonBlocking(commentsCollection, commentData);
    } finally {
      setNewComment({ fullName: '', email: '', text: '' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-6">Discussion ({comments?.length || 0})</h2>
      
      <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <input
            type="text"
            name="fullName"
            value={newComment.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full p-3 bg-base-200 border border-base-300 rounded-xl"
            required
          />
          <input
            type="email"
            name="email"
            value={newComment.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full p-3 bg-base-200 border border-base-300 rounded-xl"
            required
          />
        </div>
        <div className="relative">
            <textarea
                name="text"
                value={newComment.text}
                onChange={handleInputChange}
                placeholder="Add to the discussion..."
                className="w-full p-4 bg-base-200 border border-base-300 rounded-xl pr-14 min-h-[100px]"
                required
            />
            <button type="submit" className="absolute right-2 top-4 p-2 rounded-full bg-primary text-primary-content hover:opacity-90" disabled={isSubmitting}>
                <Send size={20} />
            </button>
        </div>
      </form>
      
      {isLoading && <div className="text-center">Loading comments...</div>}

      {!isLoading && (!comments || comments.length === 0) && (
        <p className="text-base-content/60 text-center py-4">Be the first to comment.</p>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map(comment => (
          <div key={comment.id}>
            <div className="flex items-start gap-4">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span className="text-xl">{comment.fullName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">{comment.fullName}</p>
                  <span className="text-xs text-base-content/50">&bull; {format(new Date(comment.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <p className="text-base-content/80 mb-2 whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

    