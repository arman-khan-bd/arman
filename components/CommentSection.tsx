'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      if (!profileId || !blogId || !firestore) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const commentsQuery = query(
          collection(firestore, `profiles/${profileId}/blogs/${blogId}/comments`),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(commentsQuery);
        const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [profileId, blogId, firestore]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.text.trim() || !newComment.fullName.trim() || !profileId || !firestore) return;
    
    setIsSubmitting(true);
    const createdAt = new Date().toISOString();
    const commentData = {
      ...newComment,
      profileId,
      blogId,
      blogSlug,
      createdAt,
      ownerId: profileId, // for rules
    };

    // Optimistic UI update
    const optimisticComment: Comment = {
      id: `optimistic-${Date.now()}`,
      fullName: newComment.fullName,
      text: newComment.text,
      createdAt: createdAt,
    };
    setComments(prev => [optimisticComment, ...prev]);

    const commentsCollection = collection(firestore, `profiles/${profileId}/blogs/${blogId}/comments`);
    
    try {
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
