'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collectionGroup, doc, query, orderBy, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trash2, MessageSquare, ExternalLink, AlertTriangle } from 'lucide-react';
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
  const [indexErrorUrl, setIndexErrorUrl] = useState<string | null>(null);

  const commentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    
    return query(collectionGroup(firestore, 'comments'), where('profileId', '==', user.uid), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: comments, isLoading, error } = useCollection<Comment>(commentsQuery);

  useEffect(() => {
    if (error && error.message.includes('The query requires an index')) {
      const urlMatch = error.message.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch && urlMatch[0]) {
        // The URL in the error message sometimes has a trailing period.
        setIndexErrorUrl(urlMatch[0].replace(/\.$/, ''));
      }
    } else {
      setIndexErrorUrl(null);
    }
  }, [error]);

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
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && indexErrorUrl && (
           <div className="text-center py-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
            <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" />
            <h3 className="mt-4 text-lg font-bold text-orange-800">Action Required: Create Firestore Index</h3>
            <p className="mt-2 text-orange-700 max-w-2xl mx-auto">
                This page cannot load comments correctly because a Firestore database index is missing. This is a required, one-time setup step.
            </p>
             <a
              href={indexErrorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Click Here to Create Index
            </a>
            <p className="mt-4 text-xs text-orange-600">After creating the index, please wait a few minutes for it to build, then refresh this page.</p>
          </div>
        )}

        {!isLoading && !indexErrorUrl && (!comments || comments.length === 0) && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-lg font-bold">No Comments Found</h3>
            <p className="mt-2 text-base-content/80 max-w-2xl mx-auto">
                Once users start commenting on your blog posts, their comments will appear here for moderation.
            </p>
          </div>
        )}
        {!isLoading && !indexErrorUrl && comments && comments.length > 0 && (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 rounded-lg bg-base-200">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <p className="text-sm text-base-content/80 mb-2">{comment.text}</p>
                        <div className="flex items-center gap-4 text-xs text-base-content/60 flex-wrap">
                            <span>By: <span className="font-bold">{comment.fullName}</span> ({comment.email})</span>
                            <span>On: {format(new Date(comment.createdAt), 'MMM dd, yyyy, hh:mm a')}</span>
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
