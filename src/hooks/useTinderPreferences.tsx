import { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface SwipePreference {
  recipeId: string;
  liked: boolean;
  timestamp: number;
}

export const useTinderPreferences = () => {
  const [preferences, setPreferences] = useState<SwipePreference[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const pendingBatch = useRef<SwipePreference[]>([]);

  // Flush preferences to localStorage in batches (optimized for performance)
  const flushPreferences = useCallback(
    debounce(async () => {
      if (pendingBatch.current.length === 0) return;

      setIsProcessing(true);
      const batch = [...pendingBatch.current];
      pendingBatch.current = [];

      try {
        // Store preferences in localStorage
        const existingPrefs = JSON.parse(localStorage.getItem('tinderPreferences') || '[]');
        const updatedPrefs = [...existingPrefs, ...batch];
        localStorage.setItem('tinderPreferences', JSON.stringify(updatedPrefs.slice(-100))); // Keep last 100
      } catch (error) {
        console.error('Failed to save preferences:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 2000),
    []
  );

  // Record a swipe (optimistic update)
  const recordSwipe = useCallback((recipeId: string, liked: boolean) => {
    const newPref = { recipeId, liked, timestamp: Date.now() };
    
    // Optimistic UI update
    setPreferences(prev => [...prev, newPref]);
    
    // Add to batch
    pendingBatch.current.push(newPref);
    flushPreferences();
  }, [flushPreferences]);

  return { preferences, recordSwipe, isProcessing };
};
