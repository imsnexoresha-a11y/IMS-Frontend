import { useState } from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({
  children,
  content,
  position = 'top',
  className = '',
}) {
  const [visible, setVisible] = useState(false);

  if (!content) return children;

  return (
    <span
      className={`${styles.tooltipWrapper} ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={`${styles.tooltip} ${position === 'bottom' ? styles.bottom : ''}`}>
          {content}
        </span>
      )}
    </span>
  );
}
