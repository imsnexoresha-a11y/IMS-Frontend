import Modal from '../common/Modal';
import CreateTeacherForm from './CreateTeacherForm';

export default function EditTeacherModal({ isOpen, onClose, teacher, onSave }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={teacher ? "Edit Teacher" : "Create Teacher"} size="md">
      <CreateTeacherForm
        teacher={teacher}
        onSubmit={(data) => { onSave?.({ id: teacher?.id || teacher?._id, data }); onClose(); }}
        onCancel={onClose}
      />
    </Modal>
  );
}
