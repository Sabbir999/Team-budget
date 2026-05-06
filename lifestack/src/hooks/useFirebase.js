import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase-config';

// Custom hook for reading data from Firebase
export function useFirebaseData(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;

    setLoading(true);
    setError(null);

    try {
      const dataRef = ref(db, path);
      
      const unsubscribe = onValue(dataRef, (snapshot) => {
        const snapshotData = snapshot.val();
        setData(snapshotData);
        setLoading(false);
      }, (error) => {
        setError(error);
        setLoading(false);
      });

      // Cleanup subscription
      return () => {
        off(dataRef, 'value', unsubscribe);
      };
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}

// Custom hook for real-time data with transformation
export function useRealtimeData(path, transform = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;

    setLoading(true);
    const dataRef = ref(db, path);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      try {
        let snapshotData = snapshot.val();
        
        // Apply transformation if provided
        if (transform && typeof transform === 'function') {
          snapshotData = transform(snapshotData);
        }
        
        setData(snapshotData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, (error) => {
      setError(error);
      setLoading(false);
    });

    return () => off(dataRef, 'value', unsubscribe);
  }, [path, transform]);

  return { data, loading, error };
}

// Hook for user-specific data
export function useUserData(dataType) {
  const { currentUser } = useAuth();
  
  const path = currentUser ? `users/${currentUser.uid}/${dataType}` : null;
  
  const { data, loading, error } = useFirebaseData(path);
  
  // Transform object data to array
  const transformedData = data ? Object.keys(data).map(key => ({
    id: key,
    ...data[key]
  })) : [];

  return { 
    data: transformedData, 
    loading, 
    error,
    isEmpty: !loading && transformedData.length === 0
  };
}

// Specific hooks for different data types
export function useTeams() {
  return useUserData('teams');
}

export function usePlayers() {
  return useUserData('players');
}

export function useExpenses() {
  return useUserData('expenses');
}

export function usePayments() {
  return useUserData('payments');
}