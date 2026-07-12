import { useState } from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  defaultValue = '',
  className = '',
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <div className={`${styles.searchBar} ${className}`}>
      <span className={styles.searchIcon}>
        <Search size={18} />
      </span>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.searchInput}
      />
      {value && (
        <button className={styles.clearButton} onClick={handleClear} type="button">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
