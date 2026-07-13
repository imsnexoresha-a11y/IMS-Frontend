import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  return (
    <div className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
}

export function Skeleton({ variant = 'text', width, height, className = '' }) {
  const variantClass = {
    text: styles.skeletonText,
    title: styles.skeletonTitle,
    card: styles.skeletonCard,
    avatar: styles.skeletonAvatar,
  }[variant] || styles.skeletonText;

  return (
    <div
      className={`${variantClass} ${className}`}
      style={{ width: width || undefined, height: height || undefined }}
    />
  );
}
