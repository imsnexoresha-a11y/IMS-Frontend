import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

export default function EventCorrectionForm({ onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Input label="Event ID / Reference" name="eventId" required error={errors.eventId?.message} {...register('eventId', { required: 'Required' })} />
      <Input label="Correction Type" name="correctionType" required {...register('correctionType', { required: 'Required' })} />
      <Textarea label="Details" name="details" required rows={3} error={errors.details?.message} {...register('details', { required: 'Required', minLength: { value: 10, message: 'Min 10 chars' } })} />
      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Apply Correction</Button>
      </div>
    </form>
  );
}
