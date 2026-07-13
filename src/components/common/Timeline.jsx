import styles from './Timeline.module.css';

/**
 * Timeline for audit log / lecture pipeline visualization.
 * @param {Array} items - [{ title, time, description, status: 'default'|'active'|'completed' }]
 */
export default function Timeline({ items = [], className = '' }) {
  return (
    <div className={`${styles.timeline} ${className}`}>
      {items.map((item, i) => {
        const dotClass = [
          styles.dot,
          item.status === 'active' ? styles.dotActive : '',
          item.status === 'completed' ? styles.dotCompleted : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={i} className={styles.item}>
            <div className={dotClass} />
            <div className={styles.content}>
              <div className={styles.itemTitle}>{item.title}</div>
              {item.time && <div className={styles.itemTime}>{item.time}</div>}
              {item.description && (
                <div className={styles.itemDescription}>{item.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
