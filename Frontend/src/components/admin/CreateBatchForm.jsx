import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';
import { getTeachers } from '../../api/adminApi';

export default function CreateBatchForm({ batch, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: batch ? {
      name: batch.name || '',
      teacherId: batch.teacherIds?.[0] || batch.teacherId || '',
      startDate: batch.startDate ? batch.startDate.split('T')[0] : '',
      endDate: batch.endDate ? batch.endDate.split('T')[0] : '',
    } : {}
  });
  const [teacherOpts, setTeacherOpts] = useState([]);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const data = await getTeachers();
        setTeacherOpts((data.items || []).map((t) => ({ value: t.id, label: t.name })));
      } catch (err) {
        console.error('Failed to load teachers', err);
      }
    }
    loadTeachers();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Input label="Batch Name" name="name" required error={errors.name?.message} {...register('name', { required: 'Required' })} />
      <Select label="Teacher" name="teacherId" required options={teacherOpts} error={errors.teacherId?.message} {...register('teacherId', { required: 'Required' })} />
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <DatePicker label="Start Date" name="startDate" required error={errors.startDate?.message} {...register('startDate', { required: 'Required' })} />
        <DatePicker label="End Date" name="endDate" required error={errors.endDate?.message} {...register('endDate', { required: 'Required' })} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">{batch ? 'Save Changes' : 'Create Batch'}</Button>
      </div>
    </form>
  );
}
