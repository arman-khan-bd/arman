'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send, CornerDownRight, MessageSquareReply, Loader2 } from 'lucide-react';
import { useFirestore, useUser, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, getDocs, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { gitprofileConfig } from '../../gitprofile.config';

interface Comment {
  id: string;
  fullName: string;
  text: string;
  createdAt: string; // ISO String
  replyText?: string;
  replyDate?: string;
  repliedBy?: string;
}

interface CommentSectionProps {
  profileId: string;
  blogId: string;
  blogSlug: string;
}

const inputClass = "w-full p-3 bg-base-200 border border-base-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

export const CommentSection = ({ profileId, blogId, blogSlug }: CommentSectionProps) => {
  const firestore = useFirestore();
  const { user } = useUser();
  const [newComment, setNewComment] = useState({ fullName: '', email: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Pre-fill user info from localStorage
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('commenterInfo');
    if (savedUserInfo) {
      const { fullName, email } = JSON.parse(savedUserInfo);
      setNewComment(prev => ({ ...prev, fullName, email }));
    }
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.text.trim() || !newComment.fullName.trim() || !profileId || !firestore) return;
    
    setIsSubmitting(true);
    const createdAt = new Date().toISOString();

    let visitorData = {};
    try {
      const response = await fetch('/api/log-visitor', { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          visitorData = {
            ip: result.data.query,
            country: result.data.country,
            city: result.data.city,
            countryCode: result.data.countryCode,
          };
        }
      }
    } catch (error) {
      console.error("Could not fetch visitor IP for comment:", error);
    }

    const commentData = {
      ...newComment,
      profileId,
      blogId,
      blogSlug,
      createdAt,
      ...visitorData,
    };

    const optimisticComment: Comment = {
      id: `optimistic-${Date.now()}`,
      fullName: newComment.fullName,
      text: newComment.text,
      createdAt: createdAt,
    };
    setComments(prev => [optimisticComment, ...prev]);

    const commentsCollection = collection(firestore, `profiles/${profileId}/blogs/${blogId}/comments`);
    
    addDocumentNonBlocking(commentsCollection, commentData);
    localStorage.setItem('commenterInfo', JSON.stringify({ fullName: newComment.fullName, email: newComment.email }));
    setNewComment(prev => ({ ...prev, text: '' }));
    setIsSubmitting(false);
  };
  
  const handleReplySubmit = async (commentId: string) => {
    if (!replyText.trim() || !user || !firestore) return;
    setIsSubmittingReply(true);
    
    const commentRef = doc(firestore, `profiles/${profileId}/blogs/${blogId}/comments/${commentId}`);
    
    const replyData = {
      replyText: replyText,
      replyDate: new Date().toISOString(),
      repliedBy: user.displayName || gitprofileConfig.github.username,
    };
    
    updateDocumentNonBlocking(commentRef, replyData);
    
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, ...replyData } : c));
    setReplyText('');
    setReplyingTo(null);
    setIsSubmittingReply(false);
  };


  return (
    <div className="card p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Discussion ({comments?.length || 0})</h2>
      
      {/* New Comment Form */}
      <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <input type="text" name="fullName" value={newComment.fullName} onChange={handleInputChange} placeholder="Full Name" className={inputClass} required />
           <input type="email" name="email" value={newComment.email} onChange={handleInputChange} placeholder="Email Address" className={inputClass} required />
        </div>
        <textarea name="text" value={newComment.text} onChange={handleInputChange} placeholder="Add to the discussion..." className={`${inputClass} min-h-[100px]`} required />
        <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span className="ml-2">{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
        </div>
      </form>
      
      {isLoading && <div className="text-center p-8"><Loader2 size={32} className="animate-spin text-primary mx-auto" /></div>}

      {!isLoading && (!comments || comments.length === 0) && (
        <p className="text-base-content/60 text-center py-4 border-t border-base-300">Be the first to comment.</p>
      )}

      {/* Comments List */}
      {comments && comments.length > 0 && (
        <div className="space-y-8 border-t border-base-300 pt-8">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <div className="avatar placeholder shrink-0">
                <div className="bg-neutral text-neutral-content rounded-full w-12 h-12" style={{
                  display: 'flex', width: '30px', height: '30px', justifyContent: 'center', alignItems: 'center'
                }}>
                  <span className="text-xl font-bold">{comment.fullName.charAt(0).toUpperCase()}</span>
                </div>
              </div>

              <div className="flex-1">
                {/* Original Comment */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold">{comment.fullName}</p>
                    <span className="text-xs text-base-content/50">&bull; {format(new Date(comment.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <p className="text-base-content/80 whitespace-pre-wrap">{comment.text}</p>
                  {user && !comment.replyText && (
                    <button onClick={() => setReplyingTo(comment.id === replyingTo ? null : comment.id)} className="text-primary text-xs font-bold mt-2 flex items-center gap-1 hover:underline">
                      <MessageSquareReply size={14} />
                      <span>Reply</span>
                    </button>
                  )}
                </div>

                {/* Reply Form for Admin */}
                {user && replyingTo === comment.id && (
                  <div className="space-y-2 mt-4">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Replying to ${comment.fullName}...`}
                      className={`${inputClass} min-h-[80px]`}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setReplyingTo(null)} className="btn btn-sm btn-ghost">Cancel</button>
                        <button onClick={() => handleReplySubmit(comment.id)} className="btn btn-sm btn-primary" disabled={isSubmittingReply}>
                          {isSubmittingReply ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                          <span className="ml-1">Post Reply</span>
                        </button>
                    </div>
                  </div>
                )}
                
                {/* Admin Reply */}
                {comment.replyText && (
                   <div className="flex items-start gap-3 mt-4 p-4 bg-base-200 rounded-xl border border-base-300">
                     <CornerDownRight size={18} className="text-primary shrink-0 mt-1" />
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                           <p className="font-bold">{comment.repliedBy}</p>
                           <span className="badge badge-primary badge-sm">Admin</span>
                           <span className="text-xs text-base-content/50">&bull; {format(new Date(comment.replyDate!), 'MMM dd, yyyy')}</span>
                         </div>
                         <p className="text-base-content/80 whitespace-pre-wrap">{comment.replyText}</p>
                      </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
