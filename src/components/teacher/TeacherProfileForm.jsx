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
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxWidth: '600px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <Input
          label="Phone Number"
          name="phone"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Specialization / Subject"
          name="specialization"
          error={errors.specialization?.message}
          {...register('specialization')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
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
        placeholder="Brief description about yourself (will be visible on recruiter page)..."
        error={errors.bio?.message}
        {...register('bio', {
          maxLength: {
            value: 1000,
            message: 'Biography cannot exceed 1000 characters'
          }
        })}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: '3px solid var(--color-neutral)',
          boxShadow: 'var(--shadow-offset)',
          backgroundColor: 'var(--color-bg)',
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
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-black)', color: 'var(--color-neutral)' }}>
              {profile.name?.slice(0, 2).toUpperCase() || 'TR'}
            </span>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 'var(--font-black)', fontSize: 'var(--text-xs)' }}>Current Photo</div>
          <div style={{ fontSize: 'var(--text-xxs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Updates in real-time on the sidebar and recruiter portfolio.
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-xs)' }}>
        <FileUpload
          label="Upload New Profile Picture"
          accept=".jpg,.jpeg,.png,.webp"
          maxSizeMB={5}
          onFileSelect={(file) => setProfileImage(file)}
        />
      </div>

      <Button variant="primary" type="submit" fullWidth>
        Save Profile Details
      </Button>
    </form>
  );
}
