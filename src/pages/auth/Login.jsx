import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (!result) {
        setErrorMessage('Invalid email or password.');
        return;
      }

      const isRolePath = from && (from.startsWith('/admin') || from.startsWith('/teacher') || from.startsWith('/student'));
      if (from && (!isRolePath || from.startsWith(`/${result.role}`))) {
        navigate(from, { replace: true });
        return;
      }

      const paths = {
        [ROLES.ADMIN]: '/admin',
        [ROLES.TEACHER]: '/teacher',
        [ROLES.STUDENT]: '/student',
      };

      navigate(paths[result.role] || '/login', {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error?.message || 'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-xl)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border)',
          boxShadow: 'var(--shadow-offset)',
          padding: 'var(--space-2xl)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-black)',
            marginBottom: 'var(--space-lg)',
            textAlign: 'center',
          }}
        >
          IMS Login
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}
        >
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            required
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            required
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />

          <div style={{ textAlign: 'right' }}>
            <Link
              to="/forgot-password"
              style={{
                color: 'var(--color-accent)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-bold)',
              }}
            >
              Forgot password?
            </Link>
          </div>

          {errorMessage && (
            <div
              role="alert"
              style={{
                padding: 'var(--space-sm)',
                border: '2px solid var(--color-danger)',
                color: 'var(--color-danger)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-bold)',
              }}
            >
              {errorMessage}
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={loading}
            style={{ marginTop: 'var(--space-sm)' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}