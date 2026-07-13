import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StudentProfile from '../../components/student/StudentProfile';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export default function StudentProfilePage() {
  const location = useLocation();
  const [showChangePassword, setShowChangePassword] = useState(
    location.state?.promptPasswordChange || false
  );
  
  useEffect(() => {
    if (location.state?.promptPasswordChange) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [location.state]);

  return (
    <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <StudentProfile />
      <Card>
        <div style={{ padding: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-xs)' }}>Account Security</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Update your password to keep your account secure.</p>
            </div>
            <Button variant="secondary" onClick={() => setShowChangePassword(!showChangePassword)}>
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          {showChangePassword && (
            <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
              <ChangePasswordForm />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
