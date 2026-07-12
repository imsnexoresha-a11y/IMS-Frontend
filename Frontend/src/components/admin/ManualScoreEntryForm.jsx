import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { getStudents } from '../../api/adminApi';

export default function ManualScoreEntryForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [studentOpts, setStudentOpts] = useState([]);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await getStudents();
        setStudentOpts((data.items || []).map((s) => ({ value: s.id, label: s.name })));
      } catch (err) {
        console.error('Failed to load students', err);
      }
    }
    loadStudents();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Select label="Student" name="studentId" required options={studentOpts} {...register('studentId', { required: 'Required' })} />
      <Input label="Score (30–100)" name="score" type="number" required error={errors.score?.message}
        {...register('score', { required: 'Required', valueAsNumber: true, min: { value: 30, message: 'Min 30' }, max: { value: 100, message: 'Max 100' } })} />
      <Input label="Description" name="description" required {...register('description', { required: 'Required' })} />
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Enter Score</Button>
      </div>
    </form>
  );
}
