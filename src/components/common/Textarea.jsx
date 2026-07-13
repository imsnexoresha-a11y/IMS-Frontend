import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Neobrutalist Textarea — shares Input styling
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    name,
    placeholder,
    error,
    hint,
    required = false,
    disabled = false,
    rows = 4,
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
      <textarea
        ref={ref}
        id={name}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={styles.input}
        style={{ resize: 'vertical', minHeight: '80px' }}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
});

export default Textarea;
