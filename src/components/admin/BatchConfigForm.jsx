import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const DEFAULT_CONFIG = {
  baseScore: 30,
  attendanceFull: 2.5,
  attendanceHalf: 1,
  attendanceMissed: -5,
  quizMax: 5,
  quizMissed: -2.5,
  markCap: 100,
  reason: '',
};

export default function BatchConfigForm({
  config,
  onSave,
  onCancel,
  saving = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_CONFIG,
  });

  useEffect(() => {
    reset({
      ...DEFAULT_CONFIG,
      ...(config || {}),
      reason: '',
    });
  }, [config, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}
    >
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color:
            'var(--color-text-secondary)',
        }}
      >
        Saving this configuration triggers a
        recalculation for the entire batch.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-md)',
        }}
      >
        <Input
          label="Base Score"
          type="number"
          step="0.1"
          error={errors.baseScore?.message}
          {...register('baseScore', {
            valueAsNumber: true,
          })}
        />

        <Input
          label="Full Attendance"
          type="number"
          step="0.1"
          {...register('attendanceFull', {
            valueAsNumber: true,
          })}
        />

        <Input
          label="Half Attendance"
          type="number"
          step="0.1"
          {...register('attendanceHalf', {
            valueAsNumber: true,
          })}
        />

        <Input
          label="Missed Attendance"
          type="number"
          step="0.1"
          {...register('attendanceMissed', {
            valueAsNumber: true,
          })}
        />

        <Input
          label="Maximum Quiz Score"
          type="number"
          step="0.1"
          {...register('quizMax', {
            valueAsNumber: true,
          })}
        />

        <Input
          label="Missed Quiz"
          type="number"
          step="0.1"
          {...register('quizMissed', {
            valueAsNumber: true,
          })}
        />

        <Input
          label="Mark Cap"
          type="number"
          step="0.1"
          error={errors.markCap?.message}
          {...register('markCap', {
            valueAsNumber: true,
            min: {
              value: 1,
              message:
                'Mark cap must be greater than 0',
            },
          })}
        />
      </div>

      <Textarea
        label="Reason for Change"
        required
        placeholder="Explain why this configuration is being updated"
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
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : 'Save Configuration'}
        </Button>
      </div>
    </form>
  );
}