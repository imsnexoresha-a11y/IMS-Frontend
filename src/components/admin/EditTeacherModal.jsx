import Modal from '../common/Modal';
import CreateTeacherForm from './CreateTeacherForm';

export default function EditTeacherModal({
  isOpen,
  onClose,
  teacher,
  batches = [],
  onSave,
}) {
  const isEditing = Boolean(teacher);

  const handleSubmit = async (data) => {
    await onSave?.({
      id:
        teacher?.id ||
        teacher?._id ||
        null,

      data,
      mode:
        isEditing
          ? 'edit'
          : 'create',
    });

    onClose?.();
  };

  const assignedBatches = Array.isArray(
    teacher?.assignedBatches
  )
    ? teacher.assignedBatches
      .map(
        (batch) =>
          batch?._id ||
          batch?.id ||
          batch
      )
      .filter(Boolean)
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? 'Edit Teacher'
          : 'Add Teacher'
      }
      size="md"
    >
      <CreateTeacherForm
        batches={batches}
        defaultValues={
          isEditing
            ? {
              name:
                teacher.name || '',

              email:
                teacher.email || '',

              mobileNo:
                teacher.mobileNo || '',

              designation:
                teacher.designation || '',

              bio:
                teacher.bio || '',

              linkedInUrl:
                teacher.linkedInUrl || '',

              assignedBatches,
            }
            : null
        }
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}