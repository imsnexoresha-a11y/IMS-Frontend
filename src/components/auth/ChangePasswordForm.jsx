import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';

export default function ChangePasswordForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Enter Current & New, 2: OTP
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return addToast('error', 'New password must be at least 6 characters');
    }
    setIsLoading(true);
    try {
      // Send OTP to current user's email
      await apiClient.post('/auth/send-otp', { email: user.email, type: 'change_password' });
      addToast('success', 'OTP sent to your email');
      setStep(2);
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/auth/change-password', { 
        currentPassword, 
        newPassword,
        otp
      });
      addToast('success', 'Password changed successfully!');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setOtp('');
      setStep(1);
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-sm)' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: 'var(--space-md)' }}>Change Password</h3>
      
      {step === 1 && (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '400px' }}>
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" variant="primary" disabled={isLoading} style={{ marginTop: 'var(--space-sm)' }}>
            {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '400px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enter the 6-digit OTP sent to {user.email} to confirm this change.
          </p>
          <Input
            label="OTP Code"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
            <Button type="button" variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} style={{ flex: 1 }}>
              {isLoading ? 'Confirming...' : 'Confirm Change'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
