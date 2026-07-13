import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import FileUpload from '../common/FileUpload';

export default function StudentProfileForm({ profile = {}, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const { updateUserImage, updateUser } = useAuth();
  const displayName = profile.user?.name || profile.name || 'Student';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: displayName,
      gitHubUrl: profile.githubLink || profile.gitHubUrl || '',
      linkedInUrl: profile.linkedinLink || profile.linkedInUrl || '',
      dateOfBirth: profile.dateOfBirth || '',
      educationQualification: profile.educationQualification || '',
      instituteName: profile.instituteName || '',
      gender: profile.gender || '',
      resume: profile.resume || '',
    }
  });

  const onSubmit = async (formData) => {
    let base64Pic = null;
    if (profilePic) {
      if (profilePic.size > 2 * 1024 * 1024) {
        alert('File must be under 2MB');
        return;
      }
      base64Pic = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(profilePic);
      });
    }

    const payload = { ...formData };
    if (base64Pic) {
      payload.profilePic = base64Pic;
    }
    
    // Sync the local AuthContext so the Topbar updates immediately
    if (updateUser) {
      updateUser({
        name: formData.name,
        avatar: base64Pic || currentPhotoUrl
      });
    }

    await onSave(payload);
    setIsEditing(false);
  };

  const currentPhotoUrl = profile.profilePic || profile.avatar || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Profile Header Avatar Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
        <div style={{
          width: '100px',
          height: '100px',
          border: 'var(--border)',
          backgroundColor: 'var(--color-bg)',
          backgroundImage: currentPhotoUrl ? `url(${currentPhotoUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(255, 111, 32, 0.4)',
          borderRadius: 'var(--radius-sm)'
        }}>
          {!currentPhotoUrl && (
            <span style={{ fontSize: '2rem', fontWeight: 'var(--font-black)', color: 'var(--color-ink)' }}>
              {displayName.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', color: 'var(--color-ink)' }}>{displayName}</h3>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', fontWeight: 'bold' }}>
              {profile.user?.email || profile.email || 'No email available'}
            </div>
            <span style={{ 
              backgroundColor: 'var(--color-primary-light)', 
              color: 'var(--color-primary)', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: 'var(--text-xs)', 
              fontWeight: 'var(--font-bold)' 
            }}>
              Batch: {profile.batchName || 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {!isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <ReadOnlyField label="Full Name" value={displayName} />
            <ReadOnlyField label="Date of Birth" value={profile.dateOfBirth || 'Not provided'} />
            <ReadOnlyLinkField label="GitHub" url={profile.githubLink || profile.gitHubUrl} />
            <ReadOnlyLinkField label="LinkedIn" url={profile.linkedinLink || profile.linkedInUrl} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <ReadOnlyField label="Education" value={profile.educationQualification || 'Not provided'} />
            <ReadOnlyField label="Institute" value={profile.instituteName || 'Not provided'} />
            <ReadOnlyField label="Gender" value={profile.gender || 'Not provided'} />
            <ReadOnlyLinkField label="Resume" url={profile.resume} />
          </div>

          <Button variant="primary" onClick={() => setIsEditing(true)} style={{ alignSelf: 'flex-start', marginTop: 'var(--space-md)' }}>
            ✎ Edit Information
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <Input label="Full Name" name="name" error={errors.name?.message} {...register('name', { required: 'Required' })} required />
            <Input label="Date of Birth" name="dateOfBirth" type="date" {...register('dateOfBirth')} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <Input label="GitHub Profile URL" name="gitHubUrl" type="url" placeholder="https://github.com/..." error={errors.gitHubUrl?.message} {...register('gitHubUrl')} />
            <Input label="LinkedIn Profile URL" name="linkedInUrl" type="url" placeholder="https://linkedin.com/in/..." error={errors.linkedInUrl?.message} {...register('linkedInUrl')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <Input label="Education Qualification" name="educationQualification" placeholder="B.Tech, BSc, etc." error={errors.educationQualification?.message} {...register('educationQualification')} />
            <Input label="Institute Name" name="instituteName" placeholder="University/College" error={errors.instituteName?.message} {...register('instituteName')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <Input label="Gender" name="gender" placeholder="Male/Female/Other" error={errors.gender?.message} {...register('gender')} />
            <Input label="Resume URL" name="resume" type="url" placeholder="https://..." error={errors.resume?.message} {...register('resume')} />
          </div>

          <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg)', border: 'var(--border)' }}>
            <FileUpload label="Upload New Profile Picture" accept=".jpg,.jpeg,.png" maxSizeMB={2} onFileSelect={(file) => setProfilePic(file)} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div style={{ padding: 'var(--space-sm)', border: 'var(--border)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'bold', margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)', color: 'var(--color-ink)' }}>{value}</p>
    </div>
  );
}

function ReadOnlyLinkField({ label, url }) {
  return (
    <div style={{ padding: 'var(--space-sm)', border: 'var(--border)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'bold', margin: '0 0 4px 0' }}>{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" style={{ margin: 0, fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)', color: 'var(--color-accent)', textDecoration: 'none' }}>View Link ↗</a>
      ) : (
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)' }}>Not linked</p>
      )}
    </div>
  );
}
