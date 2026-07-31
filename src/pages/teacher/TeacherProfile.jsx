import React, { useState } from 'react';
import { useTeacherProfile, useUpdateTeacherProfile } from '../../hooks/useTeachers';
import TeacherProfileForm from '../../components/teacher/TeacherProfileForm';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';

export default function TeacherProfile() {
  const toast = useToast();
  const { data: profile, isLoading, isError } = useTeacherProfile();
  const updateProfileMutation = useUpdateTeacherProfile();
  const { updateUserImage } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (isLoading) {
    return <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (isError) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--color-danger)' }}>Error loading profile.</div>;
  }

  const handleSave = async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(data);
      if (res && res.profileImage) {
        updateUserImage(res.profileImage);
      }
      toast.success('Profile Saved', 'Your professional profile has been updated successfully!');
    } catch (e) {
      toast.error('Save Failed', 'Failed to update profile: ' + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)' }}>My Professional Profile</h2>
      
      <Card>
        <div style={{ padding: 'var(--space-sm)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            Maintain your professional details, designations, and bio. These details (excluding phone/email) will be displayed on the shareable Recruiter Portfolio page.
          </p>
          <TeacherProfileForm profile={profile} onSave={handleSave} />
        </div>
      </Card>

      <Card>
        <div style={{ padding: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-xs)' }}>Account Security</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Update your password or reset via email OTP to keep your account secure.</p>
            </div>
            <Button variant="secondary" onClick={() => setShowChangePassword(!showChangePassword)}>
              {showChangePassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          {showChangePassword && (
            <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
              <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
