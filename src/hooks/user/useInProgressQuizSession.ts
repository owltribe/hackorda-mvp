import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

// Define the expected shape of the session data from the new API
interface InProgressQuizSession {
  id: number;
  selectionCriteria: string;
  // Add other fields if they were included in the API select
}

export const useInProgressQuizSession = () => {
  const { isLoaded: isClerkLoaded, isSignedIn } = useUser();

  const fetchInProgressSession = async (): Promise<InProgressQuizSession | null> => {
    // No need to fetch if Clerk isn't loaded or user isn't signed in
    if (!isClerkLoaded || !isSignedIn) {
      return null;
    }

    const response = await fetch('/api/users/me/quiz-session/in-progress');
    if (!response.ok) {
      // Handle non-404 errors differently if needed
      if (response.status === 404) {
        return null; // No session found is not necessarily an error
      }
      // You might want to parse error messages for other statuses
      throw new Error(`Failed to fetch in-progress session (Status: ${response.status})`);
    }

    const result = await response.json();
    if (!result.success) {
      // Treat API indicating no session found as null, not error
      if (result.error === "Quiz session not found") { 
        return null;
      }
      throw new Error(result.error || 'Failed to fetch in-progress session data');
    }

    return result.data; // This will be the session object or null
  };

  return useQuery<InProgressQuizSession | null, Error>({
    queryKey: ['in-progress-quiz-session'], // Unique query key
    queryFn: fetchInProgressSession,
    enabled: isClerkLoaded && isSignedIn, // Only run when Clerk is ready and user is signed in
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes
    refetchOnWindowFocus: true, // Refetch if window regains focus
    retry: 1, // Retry once on error
  });
}; 