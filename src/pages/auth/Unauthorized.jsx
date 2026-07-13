import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'teacher') {
      navigate('/teacher');
    } else if (user?.role === 'student') {
      navigate('/student');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      padding: 'var(--space-xl)',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'var(--font-black)', color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>
        403
      </h1>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-lg)' }}>
        Access Denied
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
        You do not have permission to view this page.
      </p>
      <Button variant="primary" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}
