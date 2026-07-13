import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Route guard hook — redirects if user is not authenticated
 * or does not have one of the allowed roles.
 *
 * @param {string[]} allowedRoles - Array of role strings that can access this route
 */
export function useAuthGuard(allowedRoles = []) {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      // Redirect to the user's own dashboard based on their role
      const dashboardPaths = {
        admin: '/admin',
        teacher: '/teacher',
        student: '/student',
      };
      navigate(dashboardPaths[role] || '/login', { replace: true });
    }
  }, [isAuthenticated, role, allowedRoles, navigate]);

  return { isAuthenticated, role };
}

export default useAuthGuard;
