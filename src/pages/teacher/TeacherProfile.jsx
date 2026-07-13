import { useTeacherProfile, useUpdateTeacherProfile } from '../../hooks/useTeachers';
import TeacherProfileForm from '../../components/teacher/TeacherProfileForm';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

export default function TeacherProfile() {
  const { data: profile, isLoading, isError } = useTeacherProfile();
  const updateProfileMutation = useUpdateTeacherProfile();
  const { updateUserImage } = useAuth();

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
      alert('Profile updated successfully!');
    } catch (e) {
      alert('Failed to update profile: ' + e.message);
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
    </div>
  );
}
