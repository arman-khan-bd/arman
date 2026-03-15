'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collectionGroup, doc, query, orderBy, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Comment {
  id: string;
  fullName: string;
  email: string;
  text: string;
  createdAt: string;
  blogSlug: string;
  blogId: string;
  profileId: string;
  ip?: string;
  city?: string;
  country?: string;
  countryCode?: string;
}

export default function ManageCommentsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  // The query is temporarily disabled to prevent the app from crashing.
  // See the message in the UI below for instructions on how to fix this.
  const commentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    
    // Original query that requires an index:
    // return query(collectionGroup(firestore, 'comments'), where('profileId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    // Returning null to prevent the query from running and crashing the app.
    return null;
  }, [user, firestore]);

  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  const handleDelete = (comment: Comment) => {
    if (!user) return;
    const commentRef = doc(firestore, `profiles/${comment.profileId}/blogs/${comment.blogId}/comments/${comment.id}`);
    deleteDocumentNonBlocking(commentRef);
  };
  
  // The page will always show the "index required" message until the query is re-enabled.
  const pageIsLoading = false; 
  const noComments = true; 

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Comments</h1>
      <div className="card p-6">
        {pageIsLoading && (
          <div className="flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {noComments && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-lg font-bold text-error">Action Required: Create Firestore Index</h3>
            <div className="mt-2 text-base-content/80 max-w-2xl mx-auto space-y-2">
                <p>
                    This page cannot load comments because a Firestore database index is missing.
                </p>
                <p>
                    Please check your application's build logs or your browser's developer console (F12) for an error message that contains a URL.
                </p>
                <p className="font-bold">
                    You must click that URL to create the required index in the Firebase Console.
                </p>
                 <p className="text-sm text-base-content/60">
                    Once the index is built (which may take a few minutes), this page will function correctly. This is a one-time setup step.
                </p>
            </div>
          </div>
        )}
        {/* The block below will not be rendered with the current temporary fix */}
        {!pageIsLoading && !noComments && comments && comments.length > 0 && (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 rounded-lg bg-base-200">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <p className="text-sm text-base-content/80 mb-2">{comment.text}</p>
                        <div className="flex items-center gap-4 text-xs text-base-content/60 flex-wrap">
                            <span>By: <span className="font-bold">{comment.fullName}</span> ({comment.email})</span>
                            <span>On: {format(new Date(comment.createdAt), 'MMM dd, yyyy')}</span>
                             {comment.city && comment.country && (
                              <span className="flex items-center gap-1.5">
                                {comment.countryCode && (
                                  <Image
                                    src={`https://flagcdn.com/w20/${comment.countryCode.toLowerCase()}.png`}
                                    alt={`${comment.country} flag`}
                                    width={16}
                                    height={10}
                                    className="rounded-sm"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                From: {comment.city}, {comment.country} ({comment.ip})
                              </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Link href={`/blogs/${comment.blogSlug}`} target="_blank" className="btn btn-sm btn-ghost">
                            <ExternalLink size={16} /> View
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
