import { useState } from 'react';
import { useTeacherProfile, useUpdateTeacherProfile } from '../../hooks/useTeachers';
import TeacherProfileForm from '../../components/teacher/TeacherProfileForm';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck, Lock, UserCheck, Mail, Phone, ExternalLink } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

export default function TeacherProfile() {
  const { data: profile, isLoading, isError } = useTeacherProfile();
  const updateProfileMutation = useUpdateTeacherProfile();
  const { updateUserImage } = useAuth();
  const toast = useToast();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (isLoading) {
    return <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>Loading professional profile...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: 'var(--space-xl)', color: 'var(--color-error)' }}>
        Failed to load profile. Please refresh or try logging in again.
      </div>
    );
  }

  const handleSave = async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(data);
      if (res && res.profileImage) {
        updateUserImage(res.profileImage);
      }
      if (toast?.success) toast.success('Success', 'Profile updated successfully!');
      else alert('Profile updated successfully!');
    } catch (e) {
      if (toast?.error) toast.error('Error', 'Failed to update profile: ' + e.message);
      else alert('Failed to update profile: ' + e.message);
    }
  };

  const displayName = profile?.name || 'Instructor';
  const designation = profile?.designation || 'Lead Technical Instructor';
  const specialization = profile?.specialization || 'Software Engineering';

  return (
    <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Executive Hero Header */}
      <Card className="teacher-block-hover">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '16px',
              border: '3px solid var(--color-accent)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: 'var(--color-surface)',
              backgroundImage: profile?.profileImage
                ? `url(${profile.profileImage.startsWith('http') ? profile.profileImage : `http://localhost:4000/${profile.profileImage}`})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {!profile?.profileImage && (
                <span style={{ fontSize: '2rem', fontWeight: 'var(--font-black)', color: 'var(--color-accent)' }}>
                  {displayName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: '4px' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', margin: 0, color: 'var(--color-ink)' }}>{displayName}</h1>
                <Badge variant="accent"><UserCheck size={12} style={{ marginRight: '2px' }} /> Verified Instructor</Badge>
              </div>
              <p style={{ margin: '0 0 8px 0', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
                {designation} • <span style={{ color: 'var(--color-accent)' }}>{specialization}</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--color-neutral)' }}>
                {profile?.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} /> {profile.email}
                  </span>
                )}
                {profile?.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} /> {profile.phone}
                  </span>
                )}
                {profile?.linkedInUrl && (
                  <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontWeight: 'bold', textDecoration: 'none' }}>
                    LinkedIn <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <Badge variant="info" style={{ padding: 'var(--space-xs) var(--space-md)', fontSize: 'var(--text-xs)' }}>
            Active Faculty Member
          </Badge>
        </div>
      </Card>

      {/* Main Profile Form Card */}
      <Card title="Edit Professional Information" className="teacher-block-hover">
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Maintain your instructor credentials, designation, and bio. These details will be featured on the official curriculum and student interaction portals.
        </p>
        <TeacherProfileForm profile={profile} onSave={handleSave} />
      </Card>

      {/* Glassmorphic Account Security Section (Matching Student Profile) */}
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
