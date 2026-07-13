import { useAuthContext } from '../context/AuthContext';

/**
 * Shortcut hook to access auth context
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
