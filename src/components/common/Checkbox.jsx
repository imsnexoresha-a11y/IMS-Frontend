import { forwardRef } from 'react';
import styles from './Checkbox.module.css';

const Checkbox = forwardRef(function Checkbox(
  { label, name, disabled = false, className = '', ...props },
  ref,
) {
  return (
    <label className={`${styles.checkboxWrapper} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        name={name}
        disabled={disabled}
        className={styles.checkbox}
        {...props}
      />
      {label && <span className={styles.checkboxLabel}>{label}</span>}
    </label>
  );
});

export default Checkbox;
