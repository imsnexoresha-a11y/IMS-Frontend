import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import * as teacherApi from '../../api/teacherApi';

/**
 * Modal form for creating an assignment on an existing lecture/session.
 * Shown when teacher clicks "Add Assignment" in the lecture list.
 *
 * Props:
 *  - lecture: the lecture row object
 *  - batchId: current batch ID (for query invalidation)
 *  - isOpen: boolean
 *  - onClose: function
 */
export default function AssignmentModal({ lecture, batchId, isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      assignmentTitle: '',
      assignmentDescription: '',
      assignmentDeadline: '',
      githubRepoSeed: '',
    },
  });

  const mutation = useMutation({
    mutationFn: ({ sessionId, data }) => teacherApi.createSessionAssignment(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lectures', batchId] });
      reset();
      setSubmitError(null);
      onClose();
    },
    onError: (err) => {
      setSubmitError(err.message || 'Failed to create assignment.');
    },
  });

  const handleFormSubmit = (data) => {
    setSubmitError(null);
    const deadline = data.assignmentDeadline
      ? new Date(data.assignmentDeadline).toISOString()
      : undefined;

    mutation.mutate({
      sessionId: lecture.id || lecture._id,
      data: {
        assignmentTitle: data.assignmentTitle,
        assignmentDescription: data.assignmentDescription,
        assignmentDeadline: deadline,
        githubRepoSeed: data.githubRepoSeed || undefined,
      },
    });
  };

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Add Assignment — ${lecture?.title || 'Lecture'}`}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
      >
        {/* Info banner */}
        <div
          style={{
            background: 'var(--color-primary-subtle, #eef2ff)',
            border: '1px solid var(--color-primary-light, #a5b4fc)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-primary-dark, #4338ca)',
            lineHeight: 1.5,
          }}
        >
          📢 <strong>Students will be notified</strong> with an in-app notification and email once you submit this assignment.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <Input
            label="Assignment Title"
            name="assignmentTitle"
            required
            placeholder="e.g. Build a REST API"
            error={errors.assignmentTitle?.message}
            {...register('assignmentTitle', { required: 'Assignment title is required' })}
          />
          <Input
            label="Git Repo Seed / Template (Optional)"
            name="githubRepoSeed"
            type="url"
            placeholder="https://github.com/..."
            error={errors.githubRepoSeed?.message}
            {...register('githubRepoSeed')}
          />
        </div>

        <Textarea
          label="Description / Instructions"
          name="assignmentDescription"
          required
          placeholder="Describe the task in detail — what to build, what to submit..."
          error={errors.assignmentDescription?.message}
          {...register('assignmentDescription', { required: 'Description is required' })}
        />

        <Input
          label="Submission Deadline"
          name="assignmentDeadline"
          type="datetime-local"
          required
          error={errors.assignmentDeadline?.message}
          {...register('assignmentDeadline', {
            required: 'Submission deadline is required',
            validate: (v) => {
              if (!v) return true;
              if (new Date(v) < new Date()) return 'Deadline must be in the future';
              return true;
            },
          })}
        />

        {submitError && (
          <div
            style={{
              padding: 'var(--space-sm)',
              background: 'var(--color-danger-subtle, #fee2e2)',
              border: '1px solid var(--color-danger, #ef4444)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger, #dc2626)',
              fontSize: 'var(--text-sm)',
            }}
          >
            ⚠️ {submitError}
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
          <Button variant="ghost" type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? 'Publishing...' : '📤 Publish Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
