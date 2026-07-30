import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppShell from '../layout/AppShell';

export default function RoleRoute({ allowedRoles = [] }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  const normalizedUserRole = role ? (role.toLowerCase() === 'instructor' ? 'teacher' : role.toLowerCase()) : null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    normalizedUserRole &&
    !allowedRoles.map(r => r.toLowerCase()).includes(normalizedUserRole)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AppShell
      title={location.pathname.split('/')[1]?.toUpperCase()}
    >
      <Outlet />
    </AppShell>
  );
}