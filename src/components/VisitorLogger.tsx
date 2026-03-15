'use client';

import { useEffect, useState } from 'react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, query, getDocs, limit as firestoreLimit } from 'firebase/firestore';

const SESSION_STORAGE_KEY = 'devfolio_visitor_logged';

export const VisitorLogger = () => {
  const firestore = useFirestore();
  const [profileId, setProfileId] = useState<string | null>(null);

  // Effect to fetch the profileId just once
  useEffect(() => {
    if (!firestore) return;

    const fetchProfile = async () => {
       try {
        const profilesCollection = collection(firestore, 'profiles');
        const q = query(profilesCollection, firestoreLimit(1));
        const profileSnapshot = await getDocs(q);
        if (!profileSnapshot.empty) {
          setProfileId(profileSnapshot.docs[0].id);
        }
       } catch (e) {
           console.error("Could not fetch profile for visitor logging", e);
       }
    };
    fetchProfile();

  }, [firestore]);


  // Effect to log the visitor once we have the profileId
  useEffect(() => {
    if (!profileId || !firestore) {
      return;
    }

    const hasLogged = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (hasLogged) {
      return;
    }

    const logVisitor = async () => {
      try {
        const response = await fetch('/api/log-visitor', { method: 'POST' });
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.success && result.data) {
          const visitorData = {
            ...result.data,
            ip: result.data.query, // ip-api returns the IP in the 'query' field
            profileId: profileId,
            ownerId: profileId,
            timestamp: new Date().toISOString(),
          };
          
          const visitorsCollection = collection(firestore, `profiles/${profileId}/visitors`);
          addDocumentNonBlocking(visitorsCollection, visitorData);

          sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        }
      } catch (error) {
        console.error("Failed to log visitor:", error);
      }
    };

    logVisitor();
  }, [profileId, firestore]);

  return null; // This component does not render anything
};

    