'use client';

import React, { useEffect, useRef } from 'react';
import { useInProgressQuizSession } from '@/hooks/user/useInProgressQuizSession';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const InProgressQuizNotifier: React.FC = () => {
  const router = useRouter();
  const { data: inProgressSession, isLoading } = useInProgressQuizSession();
  const toastIdRef = useRef<string | number | null>(null); // To track the toast

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) {
      return;
    }

    if (inProgressSession) {
      // Only show toast if it's not already shown for this specific session ID
      // (or if no toast is currently shown)
      if (toastIdRef.current === null) { 
        toastIdRef.current = toast.info('You have quiz in progress.', {
          id: `resume-quiz-${inProgressSession.id}`, // Use a specific ID for the toast
          description: `Module: ${inProgressSession.selectionCriteria}`,
          position: 'bottom-right',
          duration: Infinity, // Keep toast until dismissed or action taken
          dismissible: true, // Allow manual dismissal
          action: {
            label: 'Resume Quiz',
            onClick: () => {
              // Sonner dismisses toast on action click by default
              router.push(`/quiz/${inProgressSession.id}`); // Navigate to the quiz
            }
          },
          
          // Reset ref when toast is dismissed (manually or via action)
          onDismiss: () => { toastIdRef.current = null; }, 
          // Reset ref if it somehow autocloses (though duration is Infinity)
          onAutoClose: () => { toastIdRef.current = null; }, 
        });
      }
    } else {
      // If no session is in progress, dismiss any existing toast shown by this component
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }

    // Cleanup function: Ensure toast is dismissed if component unmounts 
    // or if the session finishes while the toast is shown.
    return () => {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  // Depend on the session data, loading state, and router
  }, [inProgressSession, isLoading, router]); 

  return null; // This component doesn't render anything itself
}; 