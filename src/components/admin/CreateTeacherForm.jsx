import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const EMPTY_VALUES = {
  name: '',
  email: '',
  mobileNo: '',
  password: '',
  designation: '',
  bio: '',
  linkedInUrl: '',
};

export default function CreateTeacherForm({
  onSubmit,
  onCancel,
  defaultValues = null,
}) {
  const isEditing = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: defaultValues || EMPTY_VALUES,
  });

  useEffect(() => {
    reset(defaultValues || EMPTY_VALUES);
  }, [defaultValues, reset]);

  const handleFormSubmit = async (formData) => {
    const payload = {
      name: formData.name.trim(),
      email: formData.email
        .trim()
        .toLowerCase(),
      mobileNo: formData.mobileNo.trim(),
      designation:
        formData.designation.trim(),
      bio: formData.bio?.trim() || '',
      linkedInUrl:
        formData.linkedInUrl?.trim() || '',
    };

    if (!isEditing) {
      payload.password = formData.password;
    }

    await onSubmit?.(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}
    >
      <Input
        label="Full Name"
        name="name"
        required
        placeholder="e.g. John Smith"
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: {
            value: 2,
            message:
              'Name must contain at least 2 characters',
          },
        })}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        required
        placeholder="john.smith@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value:
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message:
              'Enter a valid email address',
          },
        })}
      />

      <Input
        label="Mobile Number"
        name="mobileNo"
        type="tel"
        required
        placeholder="9876543210"
        error={errors.mobileNo?.message}
        {...register('mobileNo', {
          required:
            'Mobile number is required',
          minLength: {
            value: 10,
            message:
              'Mobile number must contain at least 10 characters',
          },
        })}
      />

      {!isEditing && (
        <Input
          label="Temporary Password"
          name="password"
          type="password"
          required
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message:
                'Password must contain at least 6 characters',
            },
          })}
        />
      )}

      <Input
        label="Designation"
        name="designation"
        required
        placeholder="e.g. Full-Stack Instructor"
        error={errors.designation?.message}
        {...register('designation', {
          required:
            'Designation is required',
        })}
      />

      <Textarea
        label="Bio"
        name="bio"
        placeholder="Short instructor profile"
        error={errors.bio?.message}
        {...register('bio')}
      />

      <Input
        label="LinkedIn URL"
        name="linkedInUrl"
        type="url"
        placeholder="https://www.linkedin.com/in/username"
        error={errors.linkedInUrl?.message}
        {...register('linkedInUrl', {
          validate: (value) => {
            if (!value) {
              return true;
            }

            try {
              const url = new URL(value);

              return (
                url.protocol === 'http:' ||
                url.protocol === 'https:' ||
                'Enter a valid URL'
              );
            } catch {
              return 'Enter a valid URL';
            }
          },
        })}
      />

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
              ? 'Update Teacher'
              : 'Create Teacher'}
        </Button>
      </div>
    </form>
  );
}