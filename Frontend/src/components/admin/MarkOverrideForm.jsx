import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { getStudents } from '../../api/adminApi';
import { MARK_CATEGORIES } from '../../utils/constants';

export default function MarkOverrideForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [studentOpts, setStudentOpts] = useState([]);
  const categoryOpts = Object.entries(MARK_CATEGORIES).map(([, v]) => ({ value: v, label: v.replace('_', ' ') }));

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await getStudents();
        setStudentOpts((data.items || []).map((s) => ({ value: s.id, label: `${s.name} — ${s.batchName || ''}` })));
      } catch (err) {
        console.error('Failed to load students', err);
      }
    }
    loadStudents();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Select label="Student" name="studentId" required options={studentOpts} error={errors.studentId?.message} {...register('studentId', { required: 'Required' })} />
      <Select label="Category" name="category" required options={categoryOpts} error={errors.category?.message} {...register('category', { required: 'Required' })} />
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <Input label="Previous Value" name="previousValue" type="number" {...register('previousValue', { valueAsNumber: true })} />
        <Input label="New Value" name="newValue" type="number" required error={errors.newValue?.message} {...register('newValue', { required: 'Required', valueAsNumber: true })} />
      </div>
      <Textarea
        label="Reason (mandatory)"
        name="reason"
        required
        rows={3}
        placeholder="Provide a detailed justification for this override (minimum 20 characters)..."
        error={errors.reason?.message}
        {...register('reason', { required: 'Reason is required', minLength: { value: 20, message: 'Reason must be at least 20 characters' } })}
      />
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Submit Override</Button>
      </div>
    </form>
  );
}
