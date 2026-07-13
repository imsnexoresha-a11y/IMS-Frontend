import styles from './Layout.module.css';
import { capitalize } from '../../utils/formatters';

export default function RoleBadge({ role }) {
  if (!role) return null;
  const roleClass = styles[`role${capitalize(role)}`] || '';
  return (
    <span className={`${styles.roleBadge} ${roleClass}`}>
      {role}
    </span>
  );
}
