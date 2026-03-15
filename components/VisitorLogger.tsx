'use client';

import { useEffect } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { gitprofileConfig } from '../gitprofile.config';

const SESSION_STORAGE_KEY = 'devfolio_visitor_logged';

export const VisitorLogger = () => {
  const firestore = useFirestore();

  useEffect(() => {
    // Ensure this entire logic runs only once per session on the client.
    const hasLogged = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const profileId = gitprofileConfig.github.username;

    if (hasLogged || !firestore || !profileId) {
      return;
    }

    const logVisitor = async () => {
      try {
        // 1. Fetch visitor data from our API route.
        const response = await fetch('/api/log-visitor', { method: 'POST' });
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const result = await response.json();

        // 2. If successful, write to Firestore.
        if (result.success && result.data) {
          const visitorData = {
            ...result.data,
            ip: result.data.query, // ip-api returns the IP in the 'query' field
            profileId: profileId,
            // No ownerId here as this is a public action. Rules will handle auth.
            timestamp: new Date().toISOString(),
          };
          
          const visitorsCollection = collection(firestore, `profiles/${profileId}/visitors`);
          addDocumentNonBlocking(visitorsCollection, visitorData);

          // 3. Mark as logged for this session.
          sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        }
      } catch (error) {
        // We log the error but don't bother the user with it.
        console.error("Failed to log visitor:", error);
      }
    };

    // We delay the execution slightly to not interfere with critical page rendering.
    const timer = setTimeout(logVisitor, 2000);
    
    return () => clearTimeout(timer);

  }, [firestore]); // Dependency on firestore instance.

  return null; // This component does not render anything
};
