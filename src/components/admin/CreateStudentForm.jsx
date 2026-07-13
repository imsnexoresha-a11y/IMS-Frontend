import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const EMPTY_VALUES = {
  name: '',
  email: '',
  password: '',
  mobileNo: '',
  enrollementNo: '',
  dob: '',
  educationQualification: '',
  gender: '',
  instituteName: '',
  batchId: '',
};

export default function CreateStudentForm({
  onSubmit,
  onCancel,
  batches = [],
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

  const batchOptions = [
    {
      value: '',
      label: 'No batch assigned',
    },
    ...batches.map((batch) => ({
      value: batch._id || batch.id,
      label: batch.name,
    })),
  ];

  const genderOptions = [
    {
      value: '',
      label: 'Select gender',
    },
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ];

  const handleFormSubmit = async (formData) => {
    const payload = {
      name: formData.name.trim(),
      email: formData.email
        .trim()
        .toLowerCase(),
      mobileNo: formData.mobileNo.trim(),
      enrollementNo:
        formData.enrollementNo.trim(),
      dob: formData.dob,
      educationQualification:
        formData.educationQualification?.trim() ||
        '',
      gender: formData.gender,
      instituteName:
        formData.instituteName.trim(),
      batchId: formData.batchId || null,
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
        placeholder="e.g. Aarav Sharma"
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
        placeholder="aarav@example.com"
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
              'Mobile number must contain at least 10 digits',
          },
        })}
      />

      <Input
        label="Enrollment Number"
        name="enrollementNo"
        required
        placeholder="IMS2026001"
        error={errors.enrollementNo?.message}
        {...register('enrollementNo', {
          required:
            'Enrollment number is required',
        })}
      />

      <Input
        label="Date of Birth"
        name="dob"
        type="date"
        required
        error={errors.dob?.message}
        {...register('dob', {
          required:
            'Date of birth is required',
        })}
      />

      <Select
        label="Gender"
        name="gender"
        required
        options={genderOptions}
        error={errors.gender?.message}
        {...register('gender', {
          required: 'Gender is required',
        })}
      />

      <Input
        label="Institute Name"
        name="instituteName"
        required
        placeholder="Example Institute of Technology"
        error={errors.instituteName?.message}
        {...register('instituteName', {
          required:
            'Institute name is required',
        })}
      />

      <Input
        label="Education Qualification"
        name="educationQualification"
        placeholder="e.g. Diploma in Information Technology"
        error={
          errors.educationQualification?.message
        }
        {...register(
          'educationQualification'
        )}
      />

      <Select
        label="Batch"
        name="batchId"
        options={batchOptions}
        error={errors.batchId?.message}
        {...register('batchId')}
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
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
              ? 'Update Student'
              : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}