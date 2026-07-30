import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';

export default function ChangePasswordForm() {
  const { user } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('direct'); // 'direct' | 'otp'
  const [otpStep, setOtpStep] = useState(1); // 1: Send OTP, 2: Enter OTP & New Password

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userEmail = user?.email || JSON.parse(localStorage.getItem('ims_user'))?.email || '';

  const notifySuccess = (msg) => {
    setSuccessMessage(msg);
    setErrorMessage('');
    if (toast?.success) toast.success('Success', msg);
  };

  const notifyError = (msg) => {
    setErrorMessage(msg);
    setSuccessMessage('');
    if (toast?.error) toast.error('Error', msg);
  };

  // Mode 1: Direct Password Change using Current Password
  const handleDirectChange = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      return notifyError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return notifyError('New passwords do not match.');
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      notifySuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      notifyError(error.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mode 2: Forgot Password via Email OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!userEmail) {
      return notifyError('User email not found. Please log in again.');
    }
    setIsLoading(true);
    try {
      await apiClient.post('/auth/send-otp', { email: userEmail.trim().toLowerCase(), type: 'forgot_password' });
      notifySuccess(`Verification 6-digit OTP code sent to ${userEmail}`);
      setOtpStep(2);
    } catch (error) {
      notifyError(error.response?.data?.message || 'Failed to send OTP to email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetWithOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (otp.trim().length < 6) {
      return notifyError('Please enter the complete 6-digit OTP code.');
    }
    if (newPassword.length < 6) {
      return notifyError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return notifyError('New passwords do not match.');
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        email: userEmail.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword
      });
      notifySuccess('Password reset successfully with OTP!');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setOtpStep(1);
      setMode('direct');
    } catch (error) {
      notifyError(error.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-sm)' }}>
      {/* Option Mode Switcher */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => { setMode('direct'); setOtpStep(1); setErrorMessage(''); setSuccessMessage(''); }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: mode === 'direct' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
            backgroundColor: mode === 'direct' ? 'var(--color-primary-light)' : 'transparent',
            color: mode === 'direct' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔑 Change Direct (Know Current Password)
        </button>
        <button
          type="button"
          onClick={() => { setMode('otp'); setOtpStep(1); setErrorMessage(''); setSuccessMessage(''); }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: mode === 'otp' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
            backgroundColor: mode === 'otp' ? 'var(--color-primary-light)' : 'transparent',
            color: mode === 'otp' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📩 Forgot Current Password? (Reset via Gmail OTP)
        </button>
      </div>

      {/* Global Inline Alerts */}
      {errorMessage && (
        <div style={{ padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px', marginBottom: 'var(--space-md)', fontSize: '0.9rem', fontWeight: 'bold' }}>
          ⚠️ {errorMessage}
        </div>
      )}
      {successMessage && (
        <div style={{ padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', borderRadius: '6px', marginBottom: 'var(--space-md)', fontSize: '0.9rem', fontWeight: 'bold' }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Mode 1: Direct Password Change */}
      {mode === 'direct' && (
        <form onSubmit={handleDirectChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '420px' }}>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password Directly'}
            </Button>
            <button
              type="button"
              onClick={() => { setMode('otp'); setOtpStep(1); setErrorMessage(''); setSuccessMessage(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
            >
              Forgot Current Password?
            </button>
          </div>
        </form>
      )}

      {/* Mode 2: Forgot Password via OTP */}
      {mode === 'otp' && (
        <div style={{ maxWidth: '420px' }}>
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Click below to send a 6-digit OTP code to your Gmail address: <strong>{userEmail}</strong>
              </p>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Sending OTP to Gmail...' : '📩 Send OTP Code to Gmail'}
              </Button>
            </form>
          )}

          {otpStep === 2 && (
            <form onSubmit={handleResetWithOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ background: '#f3e8ff', border: '1px solid #c084fc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', color: '#6b21a8', fontWeight: 'bold' }}>
                ✉️ OTP sent to {userEmail}. Enter the 6-digit code below:
              </div>

              <Input
                label="6-Digit OTP Code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                style={{ letterSpacing: '6px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', border: '2px solid #a855f7' }}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />

              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <Button type="button" variant="ghost" onClick={() => setOtpStep(1)} style={{ flex: 1 }}>
                  ← Resend OTP
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading} style={{ flex: 1 }}>
                  {isLoading ? 'Resetting...' : '🔒 Reset Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
