import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import { useBatches } from '../../hooks/useBatches';

export default function CreateTeacherForm({ teacher, onSubmit, onCancel }) {
  const isEdit = !!teacher;
  const { data: batchesData, isLoading: isLoadingBatches } = useBatches();
  
  // Extract batches array handling possible data structures
  const batchesList = Array.isArray(batchesData) ? batchesData : (batchesData?.items || batchesData?.data || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: teacher ? {
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      specialization: teacher.specialization || teacher.designation || '',
      bio: teacher.bio || '',
      linkedInUrl: teacher.linkedInUrl || '',
      assignedBatches: teacher.assignedBatches || [],
    } : {
      assignedBatches: []
    }
  });

  const onFormSubmit = (data) => {
    // Map phone -> mobileNo, and specialization -> designation for backend
    const payload = {
      name: data.name,
      email: data.email,
      mobileNo: data.phone,
      designation: data.specialization,
      bio: data.bio || '',
      linkedInUrl: data.linkedInUrl || '',
      assignedBatches: data.assignedBatches || [],
    };

    if (!isEdit) {
      payload.password = data.password;
    }

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Input
        label="Full Name"
        name="name"
        required
        placeholder="e.g. John Smith"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
        placeholder="john.smith@ims.dev"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
      />
      <Input
        label="Phone"
        name="phone"
        required
        placeholder="+1-555-0100"
        error={errors.phone?.message}
        {...register('phone', { required: 'Phone number is required' })}
      />
      {!isEdit && (
        <Input
          label="Password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
        />
      )}
      <Input
        label="Specialization / Designation"
        name="specialization"
        required
        placeholder="e.g. Full-Stack Development"
        error={errors.specialization?.message}
        {...register('specialization', { required: 'Specialization is required' })}
      />
      <Input
        label="Bio"
        name="bio"
        placeholder="e.g. JavaScript Specialist with 5 years experience"
        error={errors.bio?.message}
        {...register('bio')}
      />
      <Input
        label="LinkedIn URL"
        name="linkedInUrl"
        placeholder="https://linkedin.com/in/..."
        error={errors.linkedInUrl?.message}
        {...register('linkedInUrl')}
      />
      
      {!isEdit && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Assign to Batches
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            {isLoadingBatches ? (
              <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>Loading batches...</span>
            ) : batchesList.length === 0 ? (
              <span style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No batches available</span>
            ) : (
              batchesList.map(batch => (
                <label key={batch._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    value={batch._id}
                    {...register('assignedBatches')}
                  />
                  {batch.name}
                </label>
              ))
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">
          {isEdit ? 'Save Changes' : 'Create Teacher'}
        </Button>
      </div>
    </form>
  );
}
