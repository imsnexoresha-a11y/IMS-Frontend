import { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(function Select(
  {
    label,
    name,
    options = [],
    placeholder = 'Select...',
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
  },
  ref,
) {
  const wrapperClass = [
    styles.selectWrapper,
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
      <select
        ref={ref}
        id={name}
        name={name}
        disabled={disabled}
        required={required}
        className={styles.select}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

export default Select;
