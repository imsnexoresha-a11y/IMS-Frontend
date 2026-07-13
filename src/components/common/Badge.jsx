import styles from './Badge.module.css';

/**
 * Status Badge/Tag — variants: neutral, success, error, warning, info, accent
 */
export default function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
}) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
