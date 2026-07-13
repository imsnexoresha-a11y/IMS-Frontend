import { getInitials } from '../../utils/formatters';
import styles from './Avatar.module.css';

export default function Avatar({
  name,
  src,
  size = 'md',
  className = '',
}) {
  return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`} title={name}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
