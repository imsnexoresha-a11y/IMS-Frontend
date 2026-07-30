import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { GITHUB_URL_PATTERN } from '../../utils/constants';

export default function AssignmentSubmitModal({
  isOpen,
  onClose,
  assignmentName,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      githubLink: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        githubLink: '',
      });
    }
  }, [isOpen, reset]);

  const handleValidSubmit = async (formData) => {
    await onSubmit?.({
      ...formData,
      githubLink: formData.githubLink.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit: ${assignmentName}`}
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(handleValidSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : 'Submit GitHub Link'}
          </Button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-sm)',
          }}
        >
          Please provide the link to your GitHub repository or pull request for this assignment.
        </p>

        <Input
          label="GitHub URL"
          name="githubLink"
          type="url"
          placeholder="https://github.com/username/repository"
          required
          error={errors.githubLink?.message}
          {...register('githubLink', {
            required: 'GitHub link is required',
            validate: (value) =>
              GITHUB_URL_PATTERN.test(value.trim()) ||
              'Enter a valid GitHub repository or pull request URL',
          })}
        />
      </div>
    </Modal>
  );
}