import { useState } from 'react';
import { useTeacherDashboard } from '../../hooks/useDashboard';
import { useBatchStudents } from '../../hooks/useAttendance';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import { formatDateTime } from '../../utils/formatters';
import { User, Layers, ArrowRight } from 'lucide-react';

export default function TeacherStudents() {
  const { data: batches = [], isLoading: loadingBatches } = useTeacherDashboard();
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Auto-select first batch when loaded
  if (!selectedBatchId && batches.length > 0) {
    setSelectedBatchId(batches[0]._id || batches[0].id);
  }

  const { data: studentsData = [], isLoading: loadingStudents } = useBatchStudents(selectedBatchId);

  // Group columns for ledger details
  const ledgerColumns = [
    { key: 'sourceType', label: 'Event Type', render: (v) => <Badge variant={v === 'quiz' ? 'info' : v === 'attendance' ? 'success' : 'warning'}>{v.toUpperCase()}</Badge> },
    { key: 'points', label: 'Points Applied', render: (v) => <strong style={{ color: v >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>{v >= 0 ? `+${v}` : v}</strong> },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Applied At', render: (v) => formatDateTime(v) }
  ];

  if (loadingBatches) {
    return <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading batches...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)' }}>Student Point Breakdown</h2>
        
        {/* Batch Selector dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <Layers size={18} style={{ color: 'var(--color-text-secondary)' }} />
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            style={{
              padding: 'var(--space-xs) var(--space-md)',
              border: '2px solid var(--color-neutral)',
              fontWeight: 'var(--font-bold)',
              backgroundColor: 'var(--color-neutral-bg)',
              cursor: 'pointer'
            }}
          >
            {batches.map(b => (
              <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loadingStudents ? (
        <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading student breakdown...</div>
      ) : studentsData.length === 0 ? (
        <Card>
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-md)' }}>
            No students found in this batch.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
          {studentsData.map(({ student, ledger = [] }) => {
            const userId = student.userId || {};
            return (
              <div
                key={student._id || student.id}
                onClick={() => setSelectedStudent({ student, ledger })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                  padding: 'var(--space-md)',
                  border: '2px solid var(--color-neutral)',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-neutral-bg)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-neutral)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-bg)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)' }}>{userId.name || 'Unnamed Student'}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{student.enrollementNo || student.enrollmentNo}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--color-neutral)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Total Marks</span>
                    <strong style={{ fontSize: 'var(--text-md)', color: 'var(--color-primary)' }}>{student.totalPoints || 0} pts</strong>
                  </div>
                  <Badge variant="ghost">View Ledger <ArrowRight size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} /></Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ledger Breakdown Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`${selectedStudent?.student?.userId?.name || 'Student'} — Points Ledger`}
      >
        {selectedStudent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '2px solid var(--color-neutral)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Enrollment Number</span>
                <strong>{selectedStudent.student.enrollementNo || selectedStudent.student.enrollmentNo}</strong>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Total Cumulative Marks</span>
                <strong style={{ color: 'var(--color-primary)' }}>{selectedStudent.student.totalPoints || 0} pts</strong>
              </div>
            </div>

            <h4 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)' }}>Points Transaction History</h4>
            {selectedStudent.ledger.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-md)' }}>
                No marks ledger events recorded yet.
              </p>
            ) : (
              <DataTable
                columns={ledgerColumns}
                data={selectedStudent.ledger}
                searchPlaceholder="Filter events..."
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
