import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import StudentProfile from '../../components/student/StudentProfile';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';

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
    <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', maxWidth: '1200px', margin: '0 auto' }}>
      <StudentProfile />
      
      {/* Account Security Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.07), 0 4px 12px 0 rgba(255, 93, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(255, 93, 0, 0.15) 0%, rgba(255, 155, 102, 0.25) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent, #FF5D00)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0, color: 'var(--color-ink)' }}>
                Account Security & Password
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Update your password or reset using Gmail OTP verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowChangePassword(!showChangePassword)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: showChangePassword ? '1.5px solid rgba(0,0,0,0.15)' : 'none',
              background: showChangePassword ? 'rgba(0, 0, 0, 0.05)' : 'linear-gradient(135deg, #FF5D00 0%, #FF8533 100%)',
              color: showChangePassword ? 'var(--color-ink)' : '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: showChangePassword ? 'none' : '0 4px 14px rgba(255, 93, 0, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <Lock size={16} />
            {showChangePassword ? 'Hide Password Form' : 'Manage Password'}
          </button>
        </div>

        {showChangePassword && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <ChangePasswordForm />
          </div>
        )}
      </div>
    </div>
  );
}
