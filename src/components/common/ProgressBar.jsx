import styles from './ProgressBar.module.css';

/**
 * ProgressBar — clean progress bar with score indicator in header row
 * @param {number} value - current value
 * @param {number} max - max value (default 100)
 * @param {number} min - min value (default 0)
 * @param {string} label - optional label text
 * @param {string} size - sm | md | lg
 * @param {boolean} showValue - show value text
 * @param {boolean} gauge - render as mark gauge
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
  const numVal = Number(value) || 0;
  const range = max - min;
  const percent = range > 0 ? Math.min(100, Math.max(0, ((numVal - min) / range) * 100)) : 0;

  const sizeClass = size === 'sm' ? styles.trackSm : size === 'lg' || gauge ? styles.trackLg : '';
  const displayVal = Number.isInteger(numVal) ? numVal : numVal.toFixed(1);

  return (
    <div className={`${styles.progressWrapper} ${className}`}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {gauge ? `${displayVal} / ${max}` : `${Math.round(percent)}%`}
            </span>
          )}
        </div>
      )}
      <div className={`${styles.track} ${sizeClass}`}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
