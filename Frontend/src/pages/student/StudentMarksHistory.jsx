import { useState } from 'react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useMarksHistory } from '../../hooks/useMarks';

export default function StudentMarksHistory() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading, isError } = useMarksHistory({ page, limit });

  if (isLoading) return <LoadingSpinner />;
  
  if (isError) {
    return (
      <div style={{ padding: 'var(--space-md)' }}>
        <Card title="Marks History">
          <p style={{ color: 'var(--color-error)' }}>Failed to load marks history.</p>
        </Card>
      </div>
    );
  }

  const entries = data?.entries || [];

  return (
    <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Marks History</h1>
      <Card title="Recent Grades & Points">
        {entries.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No marks history available.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--space-sm)' }}>Date</th>
                <th style={{ padding: 'var(--space-sm)' }}>Category</th>
                <th style={{ padding: 'var(--space-sm)' }}>Details</th>
                <th style={{ padding: 'var(--space-sm)' }}>Points Earned</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id || entry.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-sm)' }}>
                    {new Date(entry.createdAt || entry.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 'var(--space-sm)', textTransform: 'capitalize' }}>
                    {entry.sourceType || entry.category || 'Manual'}
                  </td>
                  <td style={{ padding: 'var(--space-sm)' }}>
                    {entry.description || entry.reason || 'N/A'}
                  </td>
                  <td style={{ padding: 'var(--space-sm)', fontWeight: 'bold', color: entry.points > 0 ? 'var(--color-success)' : 'inherit' }}>
                    {entry.points > 0 ? `+${entry.points}` : entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
