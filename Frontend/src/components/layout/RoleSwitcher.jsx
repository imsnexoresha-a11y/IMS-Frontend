import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../utils/constants';
import styles from './Layout.module.css';

/**
 * Dev-only role switcher toolbar — allows demoing all role UIs
 */
export default function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (newRole) => {
    switchRole(newRole);
    const paths = {
      [ROLES.ADMIN]: '/admin',
      [ROLES.TEACHER]: '/teacher',
      [ROLES.STUDENT]: '/student',
    };
    // Use window.location.href to force a full page reload so the new role is 
    // initialized freshly from localStorage, avoiding any context race conditions
    window.location.href = paths[newRole] || '/';
  };

  return (
    <div className={styles.roleSwitcher}>
      <span>DEV:</span>
      {[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT].map((r) => (
        <button
          key={r}
          className={`${styles.roleSwitcherBtn} ${role === r ? styles.roleSwitcherBtnActive : ''}`}
          onClick={() => handleSwitch(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
