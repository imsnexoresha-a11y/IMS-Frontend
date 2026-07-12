import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

export default function BatchConfigForm({ config, onSave }) {
  const { register, handleSubmit } = useForm({
    defaultValues: config || { attendanceWeight: 10, quizWeight: 15, assignmentWeight: 40, codeReviewWeight: 25, bonusWeight: 10 },
  });

  return (
    <Card title="Mark Parameters">
      <form onSubmit={handleSubmit(onSave)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Weights must total 100%. These control how the final 30–100 score is computed.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <Input label="Attendance %" name="attendanceWeight" type="number" {...register('attendanceWeight', { valueAsNumber: true })} />
          <Input label="Quiz %" name="quizWeight" type="number" {...register('quizWeight', { valueAsNumber: true })} />
          <Input label="Assignment %" name="assignmentWeight" type="number" {...register('assignmentWeight', { valueAsNumber: true })} />
          <Input label="Code Review %" name="codeReviewWeight" type="number" {...register('codeReviewWeight', { valueAsNumber: true })} />
          <Input label="Bonus %" name="bonusWeight" type="number" {...register('bonusWeight', { valueAsNumber: true })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" type="submit">Save Config</Button>
        </div>
      </form>
    </Card>
  );
}
