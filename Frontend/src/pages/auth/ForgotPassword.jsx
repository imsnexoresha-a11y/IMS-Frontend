import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useToast } from '../../components/common/Toast';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/auth/send-otp', { email, type: 'forgot_password' });
      addToast('success', 'OTP sent to your email');
      setStep(2);
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const { login } = useAuth();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp, type: 'forgot_password' });
      addToast('success', 'OTP verified successfully! You are logged in.');
      // Extract tokens
      if (response && response.accessToken) {
        login(response.accessToken, response.refreshToken, response.user);
        
        // Redirect based on role
        if (response.user.role === 'admin') navigate('/admin');
        else if (response.user.role === 'teacher') navigate('/teacher/profile', { state: { promptPasswordChange: true } });
        else navigate('/student/profile', { state: { promptPasswordChange: true } });
      }
    } catch (error) {
      addToast('error', error.message || error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return addToast('error', 'Password must be at least 6 characters');
    }
    setIsLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { email, otp, newPassword, type: 'forgot_password' });
      addToast('success', 'Password reset successfully. You can now login.');
      navigate('/login');
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-secondary)',
      padding: 'var(--space-md)'
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        padding: 'var(--space-xl)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
          Login via OTP
        </h2>
        
        {step === 1 && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              Enter your email address to receive an OTP.
            </p>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/login')} style={{ width: '100%' }}>
              Back to Login
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              Enter the 6-digit OTP sent to {email}
            </p>
            <Input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
            />
            <Button type="submit" variant="primary" disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep(1)} style={{ width: '100%' }}>
              Change Email
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
              Enter your new password.
            </p>
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" variant="primary" disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
