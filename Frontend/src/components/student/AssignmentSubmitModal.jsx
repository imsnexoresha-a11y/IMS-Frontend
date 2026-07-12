import { useForm } from 'react-hook-form';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function AssignmentSubmitModal({ isOpen, onClose, assignmentName, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Submit: ${assignmentName}`} size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>Submit GitHub Link</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p style={{ fontSize: 'var(--text-sm)' }}>
          Please provide the link to your GitHub repository or PR for this assignment.
        </p>
        <Input
          label="GitHub URL"
          name="githubLink"
          placeholder="https://github.com/username/repo"
          required
          error={errors.githubLink?.message}
          {...register('githubLink', {
            required: 'GitHub link is required',
            pattern: { value: /^https?:\/\/(www\.)?github\.com\/.+/, message: 'Must be a valid GitHub URL' }
          })}
        />
      </div>
    </Modal>
  );
}
