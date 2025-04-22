
import { useUserProfileContext } from "@/context/UserProfileContext";

/**
 * Custom hook that provides access to the user profile context
 * 
 * This hook integrates with the UserProfileContext and exposes all profile-related
 * functionality throughout the application. It handles user preferences, dietary
 * restrictions, liked/disliked meals, and profile completion status.
 * 
 * Usage:
 * const { profile, updateProfile, addLikedMeal, resetProfile } = useUserProfile();
 * 
 * @returns All user profile context values and functions
 */
export const useUserProfile = () => {
  // Access the user profile context
  const context = useUserProfileContext();
  
  // Return all context values and functions for component usage
  return {
    ...context,
    // Additional utility functions can be added here if needed
    
    /**
     * Helper function to check if the user profile setup is complete
     * @returns boolean indicating whether the profile setup is complete
     */
    isProfileComplete: () => {
      return context.profile?.profileComplete === true;
    },
    
    /**
     * Helper function to check if user has specific dietary restriction
     * @param restriction - The dietary restriction to check for
     * @returns boolean indicating if user has the specified restriction
     */
    hasDietaryRestriction: (restriction: string) => {
      return context.profile?.dietaryRestrictions?.includes(restriction) || false;
    }
  };
};
