import { forwardRef } from 'react';
import styles from './Checkbox.module.css';

const RadioGroup = forwardRef(function RadioGroup(
  {
    label,
    name,
    options = [],
    value,
    onChange,
    horizontal = false,
    className = '',
    ...props
  },
  ref,
) {
  const groupClass = [
    styles.radioGroup,
    horizontal ? styles.radioGroupHorizontal : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      {label && <legend className={styles.radioGroupLabel}>{label}</legend>}
      <div className={groupClass}>
        {options.map((opt) => (
          <label key={opt.value} className={styles.radioWrapper}>
            <input
              ref={ref}
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              className={styles.radio}
              {...props}
            />
            <span className={styles.radioLabel}>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
});

export default RadioGroup;
