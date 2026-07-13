import styles from './Card.module.css';

export default function Card({
  children,
  title,
  headerAction,
  footer,
  onClick,
  noPadding = false,
  className = '',
}) {
  const classes = [
    styles.card,
    onClick ? styles.clickable : '',
    noPadding ? styles.noPadding : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
