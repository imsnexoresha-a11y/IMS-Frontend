import { useState, useEffect } from 'react';
import styles from './Tabs.module.css';

export default function Tabs({ tabs = [], defaultTab = 0, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(defaultTab);

  useEffect(() => {
    setActiveIndex(defaultTab);
  }, [defaultTab]);

  return (
    <div className={`${styles.tabs} ${className}`}>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={i === activeIndex}
            className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        {tabs.map((tab, i) => (
          <div
            key={tab.label}
            style={{ display: i === activeIndex ? 'block' : 'none' }}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
