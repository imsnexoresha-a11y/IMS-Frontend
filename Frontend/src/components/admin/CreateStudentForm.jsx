import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import { useBatches } from '../../hooks/useBatches';

export default function CreateStudentForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const { data: batchesData } = useBatches();
  const batchesList = Array.isArray(batchesData) ? batchesData : (batchesData?.items || batchesData?.data || []);
  const batchOptions = batchesList.map((b) => ({ value: b.id, label: b.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Input label="Full Name" name="name" required error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
      <Input label="Email" name="email" type="email" required error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
      <Input label="Temporary Password" name="password" required error={errors.password?.message} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <Input label="Mobile Number" name="mobileNo" required error={errors.mobileNo?.message} {...register('mobileNo', { required: 'Mobile No is required' })} />
        <Input label="Enrollment No" name="enrollementNo" required error={errors.enrollementNo?.message} {...register('enrollementNo', { required: 'Enrollment No is required' })} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <DatePicker label="Date of Birth" name="dob" required error={errors.dob?.message} {...register('dob', { required: 'DOB is required' })} />
        <Select label="Batch" name="batchId" required options={batchOptions} error={errors.batchId?.message} {...register('batchId', { required: 'Batch is required' })} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Add Student</Button>
      </div>
    </form>
  );
}
