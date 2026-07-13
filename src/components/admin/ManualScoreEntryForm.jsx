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

export default function ManualScoreEntryForm({
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
      label: getStudentName(student),
    })
  );

  const submitForm = async (data) => {
    await onSubmit?.({
      studentId: data.studentId,
      submissionId:
        data.submissionId.trim(),
      manualScore:
        Number(data.manualScore),
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
        label="Submission ID"
        placeholder="Assignment submission ID"
        error={errors.submissionId?.message}
        {...register('submissionId', {
          required:
            'Submission ID is required',
        })}
      />

      <Input
        label="Manual Score (0–10)"
        type="number"
        min="0"
        max="10"
        step="0.1"
        error={errors.manualScore?.message}
        {...register('manualScore', {
          required:
            'Manual score is required',
          valueAsNumber: true,
          min: {
            value: 0,
            message:
              'Score cannot be below 0',
          },
          max: {
            value: 10,
            message:
              'Score cannot exceed 10',
          },
        })}
      />

      <Textarea
        label="Reason"
        rows={3}
        placeholder="Explain why a manual score is required"
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
            ? 'Saving...'
            : 'Enter Score'}
        </Button>
      </div>
    </form>
  );
}