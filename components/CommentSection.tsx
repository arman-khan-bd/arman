'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageSquare, Send } from 'lucide-react';

const dummyComments = [
  {
    id: 1,
    author: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?u=jane_doe',
    date: '2 days ago',
    text: 'This is a fantastic article! Really helped me understand the topic better.',
    replies: [
      {
        id: 3,
        author: 'John Smith',
        avatar: 'https://i.pravatar.cc/150?u=john_smith',
        date: '1 day ago',
        text: 'I agree, the explanation on MCP was super clear.',
      },
    ],
  },
  {
    id: 2,
    author: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alex_johnson',
    date: '3 hours ago',
    text: 'Great read. Looking forward to more content like this.',
    replies: [],
  },
];

export const CommentSection = () => {
  const [likes, setLikes] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState(dummyComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newCommentObj = {
      id: Date.now(),
      author: 'Current User', // Placeholder
      avatar: 'https://i.pravatar.cc/150?u=current_user',
      date: 'Just now',
      text: newComment,
      replies: [],
    };
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };

  const handleReplySubmit = (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newReplyObj = {
        id: Date.now(),
        author: 'Current User',
        avatar: 'https://i.pravatar.cc/150?u=current_user_reply',
        date: 'Just now',
        text: replyText,
    };
    const updatedComments = comments.map(comment => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [...comment.replies, newReplyObj],
            };
        }
        return comment;
    });
    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText('');
  }

  const totalComments = comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0);

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-6">Discussion ({totalComments})</h2>
      
      {/* Actions */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-medium transition-colors ${
            hasLiked ? 'text-secondary' : 'text-base-content/60 hover:text-secondary'
          }`}
        >
          <Heart size={22} fill={hasLiked ? 'currentColor' : 'none'} />
          <span>{likes} Likes</span>
        </button>
        <div className="flex items-center gap-2 text-base-content/60">
          <MessageSquare size={22} />
          <span>{comments.length} Comments</span>
        </div>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-8">
        <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden relative">
                <Image src="https://i.pravatar.cc/150?u=current_user" alt="current user" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
        </div>
        <div className="flex-1 relative">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add to the discussion..."
                className="w-full p-4 bg-base-200 border border-base-300 rounded-xl pr-14"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-primary-content hover:opacity-90">
                <Send size={20} />
            </button>
        </div>
      </form>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id}>
            <div className="flex items-start gap-4">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full overflow-hidden relative">
                    <Image src={comment.avatar} alt={comment.author} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">{comment.author}</p>
                  <span className="text-xs text-base-content/50">&bull; {comment.date}</span>
                </div>
                <p className="text-base-content/80 mb-2">{comment.text}</p>
                <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="text-sm font-bold text-primary">Reply</button>
              </div>
            </div>

            {/* Replies */}
            <div className="pl-16 mt-4 space-y-4">
                {comment.replies.map(reply => (
                    <div key={reply.id} className="flex items-start gap-4">
                        <div className="avatar">
                            <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <Image src={reply.avatar} alt={reply.author} fill className="object-cover" referrerPolicy="no-referrer" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold">{reply.author}</p>
                            <span className="text-xs text-base-content/50">&bull; {reply.date}</span>
                            </div>
                            <p className="text-base-content/80">{reply.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Reply Form */}
            {replyingTo === comment.id && (
                <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="flex gap-4 mt-4 pl-16">
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-full overflow-hidden relative">
                            <Image src="https://i.pravatar.cc/150?u=current_user_reply" alt="current user" fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Replying to ${comment.author}...`}
                            className="w-full p-3 bg-base-200 border border-base-300 rounded-xl pr-12 text-sm"
                            autoFocus
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-primary text-primary-content hover:opacity-90">
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};
