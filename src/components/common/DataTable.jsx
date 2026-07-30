import { useState, useMemo } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';

import SearchBar from './SearchBar';
import Pagination from './Pagination';
import styles from './DataTable.module.css';

/**
 * DataTable — sortable, paginated, searchable table.
 *
 * @param {Array} columns
 * @param {Array} data
 * @param {number} pageSize
 * @param {boolean} searchable
 * @param {string} searchPlaceholder
 * @param {Function} onRowClick
 * @param {React.ReactNode} toolbarActions
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
  const [sortKey, setSortKey] =
    useState(null);
  const [sortDir, setSortDir] =
    useState('asc');
  const [currentPage, setCurrentPage] =
    useState(1);

  // Filter
  const filtered = useMemo(() => {
    const lower = search
      .trim()
      .toLowerCase();

    if (!lower) {
      return data;
    }

    return data.filter((row) =>
      columns.some((col) => {
        const value =
          typeof col.searchValue ===
            'function'
            ? col.searchValue(row)
            : row[col.key];

        return (
          value != null &&
          String(value)
            .toLowerCase()
            .includes(lower)
        );
      })
    );
  }, [data, search, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const column = columns.find(
        (col) => col.key === sortKey
      );

      const aValue =
        typeof column?.sortValue ===
          'function'
          ? column.sortValue(a)
          : a[sortKey];

      const bValue =
        typeof column?.sortValue ===
          'function'
          ? column.sortValue(b)
          : b[sortKey];

      if (aValue == null) {
        return 1;
      }

      if (bValue == null) {
        return -1;
      }

      const comparison =
        typeof aValue === 'number' &&
          typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(
            String(bValue)
          );

      return sortDir === 'asc'
        ? comparison
        : -comparison;
    });
  }, [
    filtered,
    sortKey,
    sortDir,
    columns,
  ]);

  // Paginate
  const totalPages = Math.ceil(
    sorted.length / pageSize
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const paginated = sorted.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((direction) =>
        direction === 'asc'
          ? 'desc'
          : 'asc'
      );
    } else {
      setSortKey(key);
      setSortDir('asc');
    }

    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) {
      return (
        <ArrowUpDown
          size={12}
          className={styles.sortIcon}
        />
      );
    }

    return sortDir === 'asc' ? (
      <ArrowUp
        size={12}
        className={styles.sortIcon}
      />
    ) : (
      <ArrowDown
        size={12}
        className={styles.sortIcon}
      />
    );
  };

  return (
    <div
      className={`${styles.tableWrapper} ${className}`}
    >
      {(searchable || toolbarActions) && (
        <div className={styles.toolbar}>
          <div
            className={styles.toolbarLeft}
          >
            {searchable && (
              <SearchBar
                placeholder={
                  searchPlaceholder
                }
                onSearch={handleSearch}
              />
            )}
          </div>

          {toolbarActions && (
            <div
              className={
                styles.toolbarRight
              }
            >
              {toolbarActions}
            </div>
          )}
        </div>
      )}

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable !== false
                    ? styles.sortable
                    : ''
                  }`}
                onClick={() => {
                  if (
                    col.sortable !== false
                  ) {
                    handleSort(col.key);
                  }
                }}
              >
                {col.label}

                {col.sortable !== false && (
                  <SortIcon
                    colKey={col.key}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles.striped}>
          {paginated.map(
            (row, index) => (
              <tr
                key={
                  row._id ||
                  row.id ||
                  index
                }
                className={`${styles.tr} ${onRowClick
                    ? styles.clickableRow
                    : ''
                  }`}
                onClick={() =>
                  onRowClick?.(row)
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={styles.td}
                  >
                    {col.render
                      ? col.render(
                        row[col.key],
                        row
                      )
                      : row[col.key] ??
                      '—'}
                  </td>
                ))}
              </tr>
            )
          )}

          {paginated.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className={styles.td}
                style={{
                  textAlign: 'center',
                  padding:
                    'var(--space-xl)',
                  color:
                    'var(--color-text-secondary)',
                }}
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div
          className={
            styles.paginationWrapper
          }
        >
          <span
            className={styles.pageInfo}
          >
            Showing{' '}
            {(safeCurrentPage - 1) *
              pageSize +
              1}
            –
            {Math.min(
              safeCurrentPage *
              pageSize,
              sorted.length
            )}{' '}
            of {sorted.length}
          </span>

          <Pagination
            currentPage={
              safeCurrentPage
            }
            totalPages={totalPages}
            onPageChange={
              setCurrentPage
            }
          />
        </div>
      )}
    </div>
  );
}