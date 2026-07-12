import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import styles from './DataTable.module.css';

/**
 * DataTable — sortable, paginated, searchable table (the workhorse).
 *
 * @param {Array} columns - [{ key, label, sortable, render }]
 * @param {Array} data - array of row objects
 * @param {number} pageSize - items per page (default 10)
 * @param {boolean} searchable - show search bar
 * @param {string} searchPlaceholder
 * @param {Function} onRowClick - optional click handler per row
 * @param {React.ReactNode} toolbarActions - extra buttons for toolbar
 */
export default function DataTable({
  columns = [],
  data = [],
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  onRowClick,
  toolbarActions,
  className = '',
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filtered = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(lower);
      }),
    );
  }, [data, search, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ArrowUpDown size={12} className={styles.sortIcon} />;
    return sortDir === 'asc' ? (
      <ArrowUp size={12} className={styles.sortIcon} />
    ) : (
      <ArrowDown size={12} className={styles.sortIcon} />
    );
  };

  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      {(searchable || toolbarActions) && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {searchable && (
              <SearchBar
                placeholder={searchPlaceholder}
                onSearch={handleSearch}
              />
            )}
          </div>
          {toolbarActions && <div className={styles.toolbarRight}>{toolbarActions}</div>}
        </div>
      )}

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable !== false ? styles.sortable : ''}`}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                {col.label}
                {col.sortable !== false && <SortIcon colKey={col.key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.striped}>
          {paginated.map((row, i) => (
            <tr
              key={row.id || i}
              className={`${styles.tr} ${onRowClick ? styles.clickableRow : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.td}
                style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)' }}
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <span className={styles.pageInfo}>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
