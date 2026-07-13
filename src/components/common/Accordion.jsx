import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Accordion.module.css';

export default function Accordion({ items = [], defaultOpen = null, className = '' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${styles.accordion} ${className}`}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={styles.item}>
            <button
              className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <ChevronDown
                size={18}
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
              />
            </button>
            {isOpen && <div className={styles.content}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
