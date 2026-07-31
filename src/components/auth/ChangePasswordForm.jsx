import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  required = true,
  showPassword,
  setShowPassword,
  name,
  minLength = 6,
  error,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          name={name}
          style={{
            width: '100%',
            padding: '10px 42px 10px 14px',
            borderRadius: '8px',
            border: `1px solid ${error ? '#ef4444' : 'var(--border-color, #cbd5e1)'}`,
            backgroundColor: 'var(--color-bg-primary, #ffffff)',
            color: 'var(--color-text-primary, #0f172a)',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary, #64748b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
          }}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: '500' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default function ChangePasswordForm({ onSuccess }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Mode: 'standard' (with current password) or 'forgot_otp' (via OTP)
  const [mode, setMode] = useState('standard');

  // Standard mode form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // OTP mode form state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Submit standard password change (using Current Password)
  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (newPassword.length < 6) {
      const errMsg = 'New password must be at least 6 characters long';
      setFormError(errMsg);
      toast.error('Validation Error', errMsg);
      return;
    }
    if (newPassword !== confirmPassword) {
      const errMsg = 'Confirm password does not match new password';
      setFormError(errMsg);
      toast.error('Validation Error', errMsg);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      toast.success('Password Updated', 'Password updated successfully! Logging out...');
      setTimeout(async () => {
        if (logout) await logout();
        navigate('/login', { replace: true });
        window.location.reload();
      }, 1000);
    } catch (error) {
      const msg = error.message || 'Failed to update password';
      setFormError(msg);
      toast.error('Update Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP for forgot password flow and immediately reveal OTP fields
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setFormError('');
    setOtpSent(true); // Instantly transition UI to show OTP, New Password, and Confirm Password fields
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/send-otp', {
        email: user?.email,
        type: 'forgot_password',
      });
      toast.success('OTP Sent', res?.message || `OTP sent to ${user?.email || 'your email'}`);
    } catch (error) {
      const msg = error.message || 'Failed to send OTP';
      setFormError(msg);
      toast.error('OTP Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit OTP password reset (no current password needed)
  const handleOtpResetSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!otp || otp.trim().length !== 6) {
      const errMsg = 'Please enter a valid 6-digit OTP code';
      setFormError(errMsg);
      toast.error('Validation Error', errMsg);
      return;
    }
    if (newPassword.length < 6) {
      const errMsg = 'New password must be at least 6 characters long';
      setFormError(errMsg);
      toast.error('Validation Error', errMsg);
      return;
    }
    if (newPassword !== confirmPassword) {
      const errMsg = 'Confirm password does not match new password';
      setFormError(errMsg);
      toast.error('Validation Error', errMsg);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', {
        email: user?.email,
        otp: otp.trim(),
        newPassword,
        type: 'forgot_password',
      });

      toast.success('Password Reset', res?.message ? `${res.message}! Logging out...` : 'Password reset successfully! Logging out...');
      setTimeout(async () => {
        if (logout) await logout();
        navigate('/login', { replace: true });
        window.location.reload();
      }, 1000);
    } catch (error) {
      const msg = error.message || 'Failed to reset password';
      setFormError(msg);
      toast.error('Reset Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setOtpSent(false);
    setFormError('');
  };

  return (
    <div style={{ maxWidth: '440px' }}>
      {formError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            fontSize: '0.88rem',
            marginBottom: 'var(--space-md)',
            fontWeight: '500',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{formError}</span>
        </div>
      )}

      {/* ── Mode 1: Standard Password Change (Current, New, Confirm) ── */}
      {mode === 'standard' && (
        <form
          onSubmit={handleStandardSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Change Password</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <PasswordInput
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setFormError('');
              }}
              showPassword={showCurrentPw}
              setShowPassword={setShowCurrentPw}
              name="currentPassword"
              required
            />
            <div style={{ textAlign: 'right', marginTop: '2px' }}>
              <button
                type="button"
                onClick={() => switchMode('forgot_otp')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary, #6366f1)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Forgot current password?
              </button>
            </div>
          </div>

          <PasswordInput
            label="New Password"
            placeholder="Enter new password (min. 6 chars)"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setFormError('');
            }}
            showPassword={showNewPw}
            setShowPassword={setShowNewPw}
            name="newPassword"
            required
            minLength={6}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFormError('');
            }}
            showPassword={showConfirmPw}
            setShowPassword={setShowConfirmPw}
            name="confirmPassword"
            required
            minLength={6}
            error={
              confirmPassword && newPassword !== confirmPassword
                ? 'Confirm password does not match new password'
                : null
            }
          />

          <Button type="submit" variant="primary" disabled={isLoading} style={{ marginTop: 'var(--space-xs)' }}>
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      )}

      {/* ── Mode 2: Forgot Current Password Flow (OTP -> New Password -> Confirm Password) ── */}
      {mode === 'forgot_otp' && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: 'var(--space-md)',
            }}
          >
            <button
              type="button"
              onClick={() => switchMode('standard')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              title="Back to standard password change"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
              Reset via Email OTP
            </h3>
          </div>

          {!otpSent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-bg-secondary, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary, #475569)',
                  lineHeight: '1.4',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  <Mail size={16} /> Send OTP Verification
                </div>
                <p style={{ margin: '6px 0 0 0' }}>
                  An OTP verification code will be sent to your registered email: <strong>{user?.email}</strong>.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleOtpResetSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
            >
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Enter the 6-digit OTP code sent to <strong>{user?.email}</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: '600' }}>
                    OTP Code <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary, #6366f1)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      textDecoration: 'underline',
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setFormError('');
                  }}
                  placeholder="123456"
                  maxLength={6}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '1.2rem',
                    letterSpacing: '4px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <PasswordInput
                label="New Password"
                placeholder="Enter new password (min. 6 chars)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setFormError('');
                }}
                showPassword={showNewPw}
                setShowPassword={setShowNewPw}
                name="newPassword"
                required
                minLength={6}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFormError('');
                }}
                showPassword={showConfirmPw}
                setShowPassword={setShowConfirmPw}
                name="confirmPassword"
                required
                minLength={6}
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? 'Confirm password does not match new password'
                    : null
                }
              />

              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => switchMode('standard')}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  style={{ flex: 1 }}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
