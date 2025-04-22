
import { useUserProfileContext } from "@/context/UserProfileContext";

/**
 * Custom hook that provides access to the user profile context
 * 
 * This is a convenience wrapper around useUserProfileContext that makes
 * it easier to import and use throughout the application.
 * 
 * Usage:
 * const { profile, updateProfile, addLikedMeal } = useUserProfile();
 * 
 * @returns All user profile context values and functions
 */
export const useUserProfile = () => useUserProfileContext();
