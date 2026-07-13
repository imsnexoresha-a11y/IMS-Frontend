import styles from './ProgressBar.module.css';

/**
 * ProgressBar — also usable as a Gauge for the 30-100 mark scale.
 * @param {number} value - current value
 * @param {number} max - max value (default 100)
 * @param {number} min - min value (default 0, use 30 for mark gauge)
 * @param {string} label - optional label text
 * @param {string} size - sm | md | lg
 * @param {boolean} showValue - show percentage text
 * @param {boolean} gauge - render as centered gauge
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  min = 0,
  label,
  size = 'md',
  showValue = true,
  gauge = false,
  className = '',
}) {
  const range = max - min;
  const percent = range > 0 ? Math.min(100, Math.max(0, ((value - min) / range) * 100)) : 0;

  const sizeClass = size === 'sm' ? styles.trackSm : size === 'lg' ? styles.trackLg : '';

  if (gauge) {
    return (
      <div className={`${styles.progressWrapper} ${styles.gauge} ${className}`}>
        {label && (
          <div className={styles.labelRow}>
            <span className={styles.label}>{label}</span>
          </div>
        )}
        <div className={`${styles.track} ${styles.trackLg}`}>
          <div className={styles.fill} style={{ width: `${percent}%` }} />
          <span className={styles.gaugeLabel}>{value.toFixed?.(1) ?? value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.progressWrapper} ${className}`}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{Math.round(percent)}%</span>}
        </div>
      )}
      <div className={`${styles.track} ${sizeClass}`}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
