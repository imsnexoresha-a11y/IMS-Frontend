import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import FileUpload from '../common/FileUpload';

export default function TeacherProfileForm({ profile = {}, onSave }) {
  const [profileImage, setProfileImage] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      specialization: profile.specialization || '',
      designation: profile.designation || '',
      bio: profile.bio || '',
      linkedInUrl: profile.linkedInUrl || '',
    }
  });

  const onSubmit = (formData) => {
    onSave({
      ...formData,
      profileImage,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
        <Input
          label="Full Name"
          name="name"
          required
          error={errors.name?.message}
          {...register('name', { required: 'Required' })}
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          disabled
          {...register('email')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
        <Input
          label="Phone Number"
          name="phone"
          placeholder="+91 9876543210"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Specialization / Subject"
          name="specialization"
          placeholder="e.g. Full Stack Web Development"
          error={errors.specialization?.message}
          {...register('specialization')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
        <Input
          label="Professional Designation"
          name="designation"
          required
          placeholder="e.g. Lead Tech Instructor"
          error={errors.designation?.message}
          {...register('designation', { required: 'Required' })}
        />
        <Input
          label="LinkedIn Profile URL"
          name="linkedInUrl"
          type="url"
          placeholder="https://linkedin.com/in/..."
          error={errors.linkedInUrl?.message}
          {...register('linkedInUrl')}
        />
      </div>

      <Textarea
        label="Instructor Biography"
        name="bio"
        placeholder="Brief description about your teaching experience, tech stack, and background..."
        error={errors.bio?.message}
        {...register('bio', {
          maxLength: {
            value: 1000,
            message: 'Biography cannot exceed 1000 characters'
          }
        })}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-bg)', borderRadius: '12px', border: '1px solid var(--color-neutral)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          border: '2px solid var(--color-accent)',
          boxShadow: 'var(--shadow-sm)',
          backgroundColor: 'var(--color-surface)',
          backgroundImage: profile.profileImage
            ? `url(${profile.profileImage.startsWith('http') ? profile.profileImage : `http://localhost:4000/${profile.profileImage}`})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {!profile.profileImage && (
            <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-black)', color: 'var(--color-accent)' }}>
              {profile.name?.slice(0, 2).toUpperCase() || 'TR'}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>Instructor Photo</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Upload a professional avatar (JPEG, PNG, WebP up to 5MB).
          </div>
        </div>
      </div>

      <div>
        <FileUpload
          label="Upload New Photo"
          accept=".jpg,.jpeg,.png,.webp"
          maxSizeMB={5}
          onFileSelect={(file) => setProfileImage(file)}
        />
      </div>

      <Button variant="primary" type="submit" style={{ marginTop: 'var(--space-xs)' }}>
        Save Profile Details
      </Button>
    </form>
  );
}
