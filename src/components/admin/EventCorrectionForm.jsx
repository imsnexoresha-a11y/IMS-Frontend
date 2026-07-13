import { useForm } from 'react-hook-form';

import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

export default function EventCorrectionForm({
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = async (data) => {
    await onSubmit?.({
      ledgerEventId:
        data.ledgerEventId.trim(),
      newMark: Number(data.newMark),
      reason: data.reason.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}
    >
      <Input
        label="Ledger Event ID"
        placeholder="Paste the ledger event ID"
        error={errors.ledgerEventId?.message}
        {...register('ledgerEventId', {
          required:
            'Ledger event ID is required',
        })}
      />

      <Input
        label="Corrected Mark"
        type="number"
        step="0.1"
        error={errors.newMark?.message}
        {...register('newMark', {
          required:
            'Corrected mark is required',
          valueAsNumber: true,
          validate: (value) =>
            Number.isFinite(value) ||
            'Enter a valid number',
        })}
      />

      <Textarea
        label="Reason"
        rows={3}
        placeholder="Explain why the event is being corrected"
        error={errors.reason?.message}
        {...register('reason', {
          required: 'Reason is required',
          minLength: {
            value: 20,
            message:
              'Reason must contain at least 20 characters',
          },
        })}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-sm)',
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading
            ? 'Correcting...'
            : 'Apply Correction'}
        </Button>
      </div>
    </form>
  );
}