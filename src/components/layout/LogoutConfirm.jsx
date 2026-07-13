import ConfirmDialog from '../common/ConfirmDialog';

export default function LogoutConfirm({ isOpen, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Logout"
      message="Are you sure you want to log out? You will need to sign in again."
      confirmLabel="Logout"
      variant="danger"
    />
  );
}
