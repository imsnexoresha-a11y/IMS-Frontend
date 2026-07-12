import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Neobrutalist Input field
 */
const Input = forwardRef(function Input(
  {
    label,
    name,
    type = 'text',
    placeholder,
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
        type={type}
        placeholder={placeholder}
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

export default Input;
