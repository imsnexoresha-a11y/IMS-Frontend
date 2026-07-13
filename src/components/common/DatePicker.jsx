import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * DatePicker — styled native date input with neobrutalist look
 */
const DatePicker = forwardRef(function DatePicker(
  {
    label,
    name,
    error,
    hint,
    required = false,
    disabled = false,
    className = '',
    ...props
  },
  ref,
) {
  const wrapperClass = [
    styles.inputWrapper,
    error ? styles.hasError : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type="date"
        disabled={disabled}
        required={required}
        className={styles.input}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
});

export default DatePicker;
