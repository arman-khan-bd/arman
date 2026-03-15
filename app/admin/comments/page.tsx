'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collectionGroup, doc, query, orderBy, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Comment {
  id: string;
  fullName: string;
  email: string;
  text: string;
  createdAt: string;
  blogSlug: string;
  blogId: string;
  profileId: string;
}

export default function ManageCommentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const commentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collectionGroup(firestore, 'comments'), where('profileId', '==', user.uid), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  const handleDelete = (comment: Comment) => {
    if (!user) return;
    const commentRef = doc(firestore, `profiles/${comment.profileId}/blogs/${comment.blogId}/comments/${comment.id}`);
    deleteDocumentNonBlocking(commentRef);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Comments</h1>
      <div className="card p-6">
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!isLoading && (!comments || comments.length === 0) && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-sm font-medium text-base-content">No comments</h3>
            <p className="mt-1 text-sm text-base-content/60">Comments from your blog posts will appear here.</p>
          </div>
        )}
        {!isLoading && comments && comments.length > 0 && (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 rounded-lg bg-base-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-base-content/80 mb-2">{comment.text}</p>
                        <div className="flex items-center gap-4 text-xs text-base-content/60">
                            <span>By: <span className="font-bold">{comment.fullName}</span> ({comment.email})</span>
                            <span>On: {format(new Date(comment.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                        <Link href={`/blogs/${comment.blogSlug}`} target="_blank" className="btn btn-sm btn-ghost">
                            <ExternalLink size={16} /> View Post
                        </Link>
                        <button onClick={() => handleDelete(comment)} className="btn btn-sm btn-error">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

    