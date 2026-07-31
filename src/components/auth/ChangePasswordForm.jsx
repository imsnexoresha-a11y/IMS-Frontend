import React, { useState, useRef } from 'react';
import { KeyRound, Lock, Mail, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useToast } from '../common/Toast';
import { useAuth } from '../../hooks/useAuth';
import styles from './ChangePasswordForm.module.css';

// 6-digit glass OTP Input Component
function GlassOtpInput({ value, onChange }) {
  const inputs = useRef([]);

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[index] = char;
    const next = arr.join('');
    onChange(next);
    if (char && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, ' ').slice(0, 6).trimEnd());
    e.preventDefault();
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className={styles.otpContainer}>
      {Array.from({ length: 6 }).map((_, i) => {
        const val = value[i] || '';
        return (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            name={`otp_digit_${i}`}
            value={val}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`${styles.otpBox} ${val ? styles.otpBoxFilled : ''}`}
          />
        );
      })}
    </div>
  );
}

// Custom Glass Password Input with Show/Hide Toggle
function GlassPasswordInput({ label, name, value, onChange, placeholder, required = true, autoComplete = 'new-password', minLength = 6 }) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.inputFieldWrapper}>
      <label className={styles.inputLabel}>
        {label} {required && <span className={styles.requiredStar}>*</span>}
      </label>
      <div className={styles.inputRel}>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={styles.glassInput}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(!show)}
          className={styles.eyeToggleBtn}
          title={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

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

  const resetFormState = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Mode 1: Direct Password Change
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
      resetFormState();
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

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
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
        otp: cleanOtp,
        newPassword
      });
      notifySuccess('Password reset successfully with OTP!');
      resetFormState();
      setOtpStep(1);
      setMode('direct');
    } catch (error) {
      notifyError(error.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.glassCard}>
      {/* Card Header */}
      <div className={styles.glassHeader}>
        <div className={styles.titleRow}>
          <div className={styles.titleIcon}>
            <ShieldCheck size={22} />
          </div>
          <h3 className={styles.titleText}>Account Security</h3>
        </div>
        <p className={styles.subtitleText}>Manage your password and authentication settings safely.</p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className={styles.tabGroup}>
        <button
          type="button"
          onClick={() => {
            setMode('direct');
            setOtpStep(1);
            resetFormState();
          }}
          className={`${styles.tabButton} ${mode === 'direct' ? styles.activeTab : ''}`}
        >
          <Lock size={15} />
          Change Password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('otp');
            setOtpStep(1);
            resetFormState();
          }}
          className={`${styles.tabButton} ${mode === 'otp' ? styles.activeTab : ''}`}
        >
          <Mail size={15} />
          Reset via Gmail OTP
        </button>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className={`${styles.statusAlert} ${styles.errorAlert}`}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{errorMessage}</div>
        </div>
      )}
      {successMessage && (
        <div className={`${styles.statusAlert} ${styles.successAlert}`}>
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{successMessage}</div>
        </div>
      )}

      {/* Mode 1: Direct Password Change */}
      {mode === 'direct' && (
        <form onSubmit={handleDirectChange} autoComplete="off">
          {/* Hidden dummy inputs to bypass Chrome autofill heuristic */}
          <input type="text" name="prevent_autofill_user" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
          <input type="password" name="prevent_autofill_pass" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <GlassPasswordInput
            label="Current Password"
            name="user_current_password_field"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="off"
            required
          />

          <GlassPasswordInput
            label="New Password"
            name="newPassword"
            placeholder="Enter new password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />

          <GlassPasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />

          <button type="submit" className={styles.glassSubmitBtn} disabled={isLoading}>
            <KeyRound size={18} />
            {isLoading ? 'Updating Password...' : 'Update Password Directly'}
          </button>
        </form>
      )}

      {/* Mode 2: Forgot Password via OTP */}
      {mode === 'otp' && (
        <div>
          {otpStep === 1 && (
            <form onSubmit={handleSendOtp} autoComplete="off">
              <div className={`${styles.statusAlert} ${styles.infoAlert}`}>
                <Mail size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  Click below to send a 6-digit OTP verification code to your email: <strong>{userEmail}</strong>
                </div>
              </div>

              <button type="submit" className={styles.glassSubmitBtn} disabled={isLoading}>
                <Mail size={18} />
                {isLoading ? 'Sending OTP to Gmail...' : '📩 Send OTP Code to Gmail'}
              </button>
            </form>
          )}

          {otpStep === 2 && (
            <form onSubmit={handleResetWithOtp} autoComplete="off">
              {/* Hidden inputs to prevent browser credential auto-injection */}
              <input type="text" name="fake_username_remember" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="password" name="fake_password_remember" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className={`${styles.statusAlert} ${styles.infoAlert}`}>
                <Mail size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  OTP sent to <strong>{userEmail}</strong>. Enter the 6-digit code below:
                </div>
              </div>

              <div className={styles.inputFieldWrapper}>
                <label className={styles.inputLabel}>
                  6-Digit OTP Code <span className={styles.requiredStar}>*</span>
                </label>
                <GlassOtpInput value={otp} onChange={setOtp} />
              </div>

              <GlassPasswordInput
                label="New Password"
                name="newPassword"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />

              <GlassPasswordInput
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
              />

              <div className={styles.btnRow}>
                <button
                  type="button"
                  onClick={() => setOtpStep(1)}
                  className={styles.glassSecondaryBtn}
                >
                  <ArrowLeft size={16} /> Resend OTP
                </button>
                <button
                  type="submit"
                  className={styles.glassSubmitBtn}
                  disabled={isLoading}
                  style={{ flex: 1.5, marginTop: 0 }}
                >
                  <Lock size={18} />
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
