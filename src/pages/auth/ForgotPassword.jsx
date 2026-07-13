import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Key, ShieldCheck, Lock } from 'lucide-react';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import * as authApi from '../../api/authApi';
import { ROLES } from '../../utils/constants';

// ──────────────────────────────────────────────
// Step indicators
// ──────────────────────────────────────────────
const STEP_EMAIL = 'email';
const STEP_OTP = 'otp';
const STEP_DONE = 'done';

// ──────────────────────────────────────────────
// 6-box OTP input component
// ──────────────────────────────────────────────
function OtpInput({ value, onChange }) {
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
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: '48px',
            height: '56px',
            textAlign: 'center',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-black)',
            border: `2px solid ${value[i] ? 'var(--color-primary)' : 'var(--color-neutral)'}`,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            letterSpacing: '0',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={(e) => (e.target.style.borderColor = value[i] ? 'var(--color-primary)' : 'var(--color-neutral)')}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  // After OTP login succeeds
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingTokens, setPendingTokens] = useState(null);

  // ── Change password inline state ──
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState(false);

  // ── Step 1: Send OTP ──
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.sendOtp(email.trim().toLowerCase());
      setStep(STEP_OTP);
      startResendTimer();
    } catch (err) {
      setError(err?.message || 'Failed to send OTP. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setError('');
    setLoading(true);
    try {
      await authApi.sendOtp(email.trim().toLowerCase());
      setOtp('');
      startResendTimer();
    } catch (err) {
      setError(err?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP & auto-login ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.replace(/\s/g, '').length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(email.trim().toLowerCase(), otp.trim());
      // Store tokens
      const accessToken = res.accessToken || res.token;
      const refreshToken = res.refreshToken || '';
      const rawRole = res.user?.role || '';
      const normalizedRole = rawRole.toLowerCase() === 'instructor' ? 'teacher' : rawRole.toLowerCase();
      const normalizedUser = { ...res.user, role: normalizedRole };

      localStorage.setItem('ims_token', accessToken);
      localStorage.setItem('ims_refresh_token', refreshToken);
      localStorage.setItem('ims_user', JSON.stringify(normalizedUser));

      setPendingUser(normalizedUser);
      setPendingTokens({ accessToken, refreshToken });
      setStep(STEP_DONE);
      setShowChangePasswordModal(true);
    } catch (err) {
      setError(err?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── After modal: navigate to dashboard ──
  const finishAndGoToDashboard = () => {
    setShowChangePasswordModal(false);
    const paths = {
      [ROLES.ADMIN]: '/admin',
      [ROLES.TEACHER]: '/teacher',
      [ROLES.STUDENT]: '/student',
    };
    navigate(paths[pendingUser?.role] || '/login', { replace: true });
    // Reload page to pick up new auth context
    window.location.reload();
  };

  // ── Change password after OTP login ──
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwError('');
    if (newPassword.length < 6) {
      setChangePwError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePwError('Passwords do not match.');
      return;
    }
    setChangePwLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });
      setChangePwSuccess(true);
      setTimeout(finishAndGoToDashboard, 1500);
    } catch (err) {
      setChangePwError(err?.message || 'Failed to change password.');
    } finally {
      setChangePwLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  const cardStyle = {
    width: '100%',
    maxWidth: '480px',
    padding: 'var(--space-2xl)',
    border: 'var(--border)',
    boxShadow: 'var(--shadow-offset)',
    backgroundColor: 'var(--color-surface)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* ── Step indicator ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: 'var(--space-lg)', alignItems: 'center' }}>
        {[
          { label: '1. Email', icon: Mail, key: STEP_EMAIL },
          { label: '2. OTP', icon: Key, key: STEP_OTP },
          { label: '3. Done', icon: ShieldCheck, key: STEP_DONE },
        ].map(({ label, icon: Icon, key }, idx, arr) => {
          const active = step === key;
          const done = arr.findIndex(s => s.key === step) > idx;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontWeight: active || done ? 'var(--font-bold)' : 'normal',
                color: active ? 'var(--color-primary)' : done ? 'var(--color-success)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-sm)',
              }}>
                <Icon size={16} />
                {label}
              </div>
              {idx < arr.length - 1 && (
                <div style={{ width: '28px', height: '2px', background: done ? 'var(--color-success)' : 'var(--color-neutral)' }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={cardStyle}>
        {/* ── STEP 1: Email ── */}
        {step === STEP_EMAIL && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary-subtle, #eef2ff)', marginBottom: 'var(--space-md)' }}>
                <Mail size={28} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)' }}>Forgot Password?</h1>
              <p style={{ marginTop: 'var(--space-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
                Enter your registered email address and we'll send you a 6-digit OTP to log in.
              </p>
            </div>

            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                placeholder="name@example.com"
                required
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <div role="alert" style={{ padding: 'var(--space-sm)', border: '2px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', borderRadius: 'var(--radius-md)' }}>
                  ⚠️ {error}
                </div>
              )}

              <Button type="submit" variant="primary" fullWidth disabled={loading || !email.trim()}>
                {loading ? 'Sending OTP...' : '📤 Send OTP'}
              </Button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP entry ── */}
        {step === STEP_OTP && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary-subtle, #eef2ff)', marginBottom: 'var(--space-md)' }}>
                <Key size={28} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)' }}>Enter OTP</h1>
              <p style={{ marginTop: 'var(--space-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
                We sent a 6-digit code to <strong>{email}</strong>.<br />
                It expires in <strong>10 minutes</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <OtpInput value={otp} onChange={setOtp} />

              {error && (
                <div role="alert" style={{ padding: 'var(--space-sm)', border: '2px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', borderRadius: 'var(--radius-md)' }}>
                  ⚠️ {error}
                </div>
              )}

              <Button type="submit" variant="primary" fullWidth disabled={loading || otp.replace(/\s/g, '').length < 6}>
                {loading ? 'Verifying...' : '✅ Verify & Log In'}
              </Button>

              <div style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  disabled={resendCountdown > 0 || loading}
                  onClick={handleResendOtp}
                  style={{
                    background: 'none', border: 'none', cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                    color: resendCountdown > 0 ? 'var(--color-text-secondary)' : 'var(--color-primary)',
                    fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)',
                  }}
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                </button>
              </div>

              <button type="button" onClick={() => { setStep(STEP_EMAIL); setError(''); setOtp(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                ← Change email
              </button>
            </form>
          </>
        )}

        {/* ── STEP 3: Done ── */}
        {step === STEP_DONE && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.12)' }}>
              <ShieldCheck size={36} style={{ color: 'var(--color-success)' }} />
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--color-success)' }}>Logged In!</h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Welcome back, <strong>{pendingUser?.name}</strong>. You are now logged in.
            </p>
            <Button variant="primary" fullWidth onClick={finishAndGoToDashboard}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>

      <Link
        to="/login"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          marginTop: 'var(--space-lg)', color: 'var(--color-accent)',
          fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)',
        }}
      >
        <ArrowLeft size={16} />
        Back to Login
      </Link>

      {/* ── Change Password Dialog ── */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          finishAndGoToDashboard();
        }}
        title="🔐 Would you like to change your password?"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
            You are now logged in via OTP. Since you requested password recovery, you can <strong>set a new password</strong> right now, or skip and go to your dashboard.
          </p>

          {changePwSuccess ? (
            <div style={{ padding: 'var(--space-md)', background: 'rgba(34,197,94,0.1)', border: '2px solid var(--color-success)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)', fontWeight: 'var(--font-bold)', textAlign: 'center' }}>
              ✅ Password changed successfully! Redirecting...
            </div>
          ) : (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-sm)' }}>
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  placeholder="At least 6 characters"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  placeholder="Repeat your new password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {changePwError && (
                <div role="alert" style={{ padding: 'var(--space-sm)', border: '2px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', borderRadius: 'var(--radius-md)' }}>
                  ⚠️ {changePwError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                <Button type="button" variant="ghost" onClick={finishAndGoToDashboard} disabled={changePwLoading}>
                  Skip, go to dashboard
                </Button>
                <Button type="submit" variant="primary" disabled={changePwLoading || !newPassword || !confirmPassword}>
                  {changePwLoading ? 'Saving...' : '🔒 Set New Password'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}