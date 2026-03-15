'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Trash2, Mail, MessageSquare, Eye, EyeOff } from 'lucide-react';

interface Message {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function ManageMessagesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const messagesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `profiles/${user.uid}/messages`), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

  const handleDelete = (messageId: string) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this message?')) {
        const messageRef = doc(firestore, `profiles/${user.uid}/messages/${messageId}`);
        deleteDocumentNonBlocking(messageRef);
    }
  };
  
  const toggleReadStatus = (messageId: string, currentStatus: boolean) => {
    if (!user) return;
    const messageRef = doc(firestore, `profiles/${user.uid}/messages/${messageId}`);
    updateDocumentNonBlocking(messageRef, { isRead: !currentStatus });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Messages</h1>
      <div className="card p-6">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!isLoading && (!messages || messages.length === 0) && (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-base-content/30" />
            <h3 className="mt-2 text-lg font-bold">No Messages Found</h3>
            <p className="mt-2 text-base-content/80 max-w-2xl mx-auto">
                Messages sent from your contact form will appear here.
            </p>
          </div>
        )}
        {!isLoading && messages && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`p-4 rounded-lg ${message.isRead ? 'bg-base-200' : 'bg-primary/5 border border-primary/20'}`}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg">{message.subject}</h3>
                      {!message.isRead && <div className="badge badge-primary badge-sm">New</div>}
                    </div>

                    <p className="text-sm text-base-content/70 mb-3 whitespace-pre-wrap">{message.message}</p>
                    
                    <div className="text-xs text-base-content/60">
                        <p><span className="font-semibold">From:</span> {message.fullName} ({message.email})</p>
                        <p><span className="font-semibold">Received:</span> {format(new Date(message.createdAt), 'MMM dd, yyyy, hh:mm a')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex gap-2">
                        <a href={`mailto:${message.email}`} className="btn btn-sm btn-ghost">
                            <Mail size={16} /> Reply
                        </a>
                        <button onClick={() => toggleReadStatus(message.id, message.isRead)} className="btn btn-sm btn-ghost">
                            {message.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                            {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button onClick={() => handleDelete(message.id)} className="btn btn-sm btn-error">
                            <Trash2 size={16} />
                        </button>
                    </div>
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
