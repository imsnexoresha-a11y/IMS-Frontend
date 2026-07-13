import { useForm } from 'react-hook-form';

import Select from '../common/Select';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

function getStudentName(student) {
  return (
    student?.userId?.name ||
    student?.user?.name ||
    student?.name ||
    'Unnamed student'
  );
}

export default function MarkOverrideForm({
  students = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const studentOptions = students.map(
    (student) => ({
      value: student._id || student.id,
      label: `${getStudentName(student)} — ${student.enrollementNo || 'No enrollment number'
        }`,
    })
  );

  const submitForm = async (data) => {
    await onSubmit?.({
      studentId: data.studentId,
      delta: Number(data.delta),
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
      <Select
        label="Student"
        options={studentOptions}
        error={errors.studentId?.message}
        {...register('studentId', {
          required: 'Student is required',
        })}
      />

      <Input
        label="Score Adjustment"
        type="number"
        step="0.1"
        placeholder="Use a negative value to deduct marks"
        error={errors.delta?.message}
        {...register('delta', {
          required: 'Score adjustment is required',
          valueAsNumber: true,
          validate: (value) =>
            Number.isFinite(value) ||
            'Enter a valid number',
        })}
      />

      <Textarea
        label="Reason"
        rows={3}
        placeholder="Explain the reason for this override"
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
            ? 'Submitting...'
            : 'Submit Override'}
        </Button>
      </div>
    </form>
  );
}