import { useState, useMemo } from 'react';
import { Calendar, Edit, Trash2, BarChart2, Plus, FilePlus } from 'lucide-react';
import {
  useLectures,
  useCreateLecture,
  useUpdateLecture,
  useDeleteLecture,
  useUpdateLectureStatus
} from '../../hooks/useLectures';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button, { IconButton } from '../common/Button';
import Modal from '../common/Modal';
import LectureForm from './LectureForm';
import LectureStatusControl from './LectureStatusControl';
import PerLectureSummaryCard from './PerLectureSummaryCard';
import AssignmentModal from './AssignmentModal';
import { formatDateTime } from '../../utils/formatters';

const STATUS_VARIANTS = { scheduled: 'info', in_progress: 'warning', completed: 'success', cancelled: 'error' };

export default function LectureList({ batchId }) {
  const resolvedBatchId = batchId || 'batch-001';

  // React Queries
  const { data: lectures = [], isLoading, isError } = useLectures(resolvedBatchId);

  // Mutations
  const createLectureMutation = useCreateLecture();
  const updateLectureMutation = useUpdateLecture();
  const deleteLectureMutation = useDeleteLecture();
  const updateStatusMutation = useUpdateLectureStatus();

  // Filter and Modals Local State
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [summaryLecture, setSummaryLecture] = useState(null);
  const [statusLecture, setStatusLecture] = useState(null);
  const [assignmentLecture, setAssignmentLecture] = useState(null);

  // Sort lectures chronologically (closest coming at top) and filter by status
  const sortedAndFilteredLectures = useMemo(() => {
    let list = [...lectures];

    if (statusFilter !== 'all') {
      list = list.filter((l) => l.status === statusFilter);
    }

    return list.sort((a, b) => {
      const timeA = new Date(a.date || a.sessionDateAndTime || 0).getTime();
      const timeB = new Date(b.date || b.sessionDateAndTime || 0).getTime();
      return timeA - timeB;
    });
  }, [lectures, statusFilter]);

  if (isLoading) {
    return <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading lectures...</div>;
  }

  if (isError) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--color-danger)' }}>Error loading lectures.</div>;
  }

  const handleAddLecture = async (data) => {
    try {
      await createLectureMutation.mutateAsync({
        batchId: resolvedBatchId,
        data
      });
      setIsAddOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create session');
    }
  };

  const handleUpdateLecture = async (data) => {
    if (!editingLecture) return;
    try {
      await updateLectureMutation.mutateAsync({
        batchId: resolvedBatchId,
        lectureId: editingLecture.id,
        data
      });
      setEditingLecture(null);
    } catch (err) {
      alert(err.message || 'Failed to update session');
    }
  };

  const handleDeleteLecture = async (lecture) => {
    if (window.confirm(`Are you sure you want to delete "${lecture.title}"?`)) {
      try {
        if (lecture.status === 'in_progress') {
          await updateStatusMutation.mutateAsync({
            batchId: resolvedBatchId,
            lectureId: lecture.id,
            status: 'cancelled'
          });
        } else {
          await deleteLectureMutation.mutateAsync({
            batchId: resolvedBatchId,
            lectureId: lecture.id
          });
        }
      } catch (err) {
        alert(err.message || 'Failed to delete lecture');
      }
    }
  };

  const handleStatusChange = async (lectureId, status) => {
    try {
      await updateStatusMutation.mutateAsync({
        batchId: resolvedBatchId,
        lectureId,
        status
      });
      setStatusLecture(null);
    } catch (err) {
      alert(err.message || 'Failed to update lecture status');
    }
  };

  const columns = [
    { key: 'title', label: 'Lecture Title' },
    { key: 'date', label: 'Date & Time', render: (v, row) => formatDateTime(v || row.sessionDateAndTime) },
    {
      key: 'status',
      label: 'Status',
      render: (v, row) => (
        <span onClick={() => setStatusLecture(row)} style={{ cursor: 'pointer' }}>
          <Badge variant={STATUS_VARIANTS[v] || 'neutral'} dot>
            {v.replace('_', ' ')}
          </Badge>
        </span>
      )
    },
    { key: 'attendanceCount', label: 'Attendance', render: (v) => v ?? '—' },
    { key: 'avgQuizScore', label: 'Avg Quiz', render: (v) => v ? `${Number(v).toFixed(1)}` : '—' },
    { key: 'avgAssignmentScore', label: 'Avg Assignment', render: (v) => v ? `${Number(v).toFixed(1)}` : '—' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-xxs)' }}>
          <IconButton
            icon={BarChart2}
            size="sm"
            label="View Averages Summary"
            onClick={() => setSummaryLecture(row)}
          />
          {/* Add Assignment button — shown when no assignment exists yet */}
          {!row.assignmentTitle ? (
            <IconButton
              icon={FilePlus}
              size="sm"
              label="Add Assignment to this Lecture"
              onClick={() => setAssignmentLecture(row)}
            />
          ) : (
            <IconButton
              icon={FilePlus}
              size="sm"
              label="Assignment already attached"
              disabled
              style={{ opacity: 0.35, cursor: 'not-allowed' }}
            />
          )}
          {row.status === 'scheduled' ? (
            <IconButton
              icon={Edit}
              size="sm"
              label="Edit Lecture"
              onClick={() => setEditingLecture(row)}
            />
          ) : (
            <IconButton
              icon={Edit}
              size="sm"
              label="Only scheduled sessions can be edited"
              disabled
              style={{ opacity: 0.4, cursor: 'not-allowed' }}
            />
          )}
          <IconButton
            icon={Trash2}
            size="sm"
            variant="danger"
            label="Delete Lecture"
            onClick={() => handleDeleteLecture(row)}
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={sortedAndFilteredLectures}
        searchPlaceholder="Search lectures..."
        toolbarActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 'var(--space-xs) var(--space-sm)',
                border: '2px solid var(--color-neutral)',
                fontWeight: 'var(--font-bold)',
                backgroundColor: 'var(--color-neutral-bg)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
            </select>

            <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
              <Plus size={16} style={{ marginRight: '4px' }} /> Schedule Lecture
            </Button>
          </div>
        }
      />

      {/* Add Lecture Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Schedule New Lecture/Session">
        <LectureForm onSubmit={handleAddLecture} onCancel={() => setIsAddOpen(false)} batchId={resolvedBatchId} />
      </Modal>

      {/* Edit Lecture Modal */}
      <Modal isOpen={!!editingLecture} onClose={() => setEditingLecture(null)} title="Edit Lecture/Session">
        {editingLecture && (
          <LectureForm
            defaultValues={{
              title: editingLecture.title,
              courseId: editingLecture.courseId || '',
              topicId: editingLecture.topicId || editingLecture.topicIds?.[0] || '',
              sessionDateAndTime: (editingLecture.date || editingLecture.sessionDateAndTime) ? new Date(editingLecture.date || editingLecture.sessionDateAndTime).toISOString().split('T')[0] : '',
              startTime: editingLecture.startTime || '',
              endTime: editingLecture.endTime || '',
              half1EndTime: editingLecture.half1EndTime || '',
              meetUrl: editingLecture.meetUrl || '',
              assignmentTitle: editingLecture.assignmentTitle || '',
              assignmentDescription: editingLecture.assignmentDescription || '',
              assignmentDeadline: editingLecture.assignmentDeadline || '',
              githubRepoSeed: editingLecture.githubRepoSeed || '',
            }}
            onSubmit={handleUpdateLecture}
            onCancel={() => setEditingLecture(null)}
            batchId={resolvedBatchId}
          />
        )}
      </Modal>

      {/* Status Transition Modal */}
      <Modal isOpen={!!statusLecture} onClose={() => setStatusLecture(null)} title="Transition Lecture Status">
        {statusLecture && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
            <h4 style={{ fontWeight: 'var(--font-bold)' }}>{statusLecture.title}</h4>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Configure and change the status of this lecture session. Changing to "Completed" triggers the assignment publication.
            </div>
            <LectureStatusControl
              status={statusLecture.status}
              lectureDate={statusLecture.date}
              endTime={statusLecture.endTime}
              onStatusChange={(status) => handleStatusChange(statusLecture.id, status)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <Button variant="ghost" onClick={() => setStatusLecture(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Summary Modal */}
      <Modal isOpen={!!summaryLecture} onClose={() => setSummaryLecture(null)} title="Session Performance Summary">
        {summaryLecture && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <PerLectureSummaryCard batchId={resolvedBatchId} lecture={summaryLecture} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <Button variant="primary" onClick={() => setSummaryLecture(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Assignment Modal */}
      {assignmentLecture && (
        <AssignmentModal
          lecture={assignmentLecture}
          batchId={resolvedBatchId}
          isOpen={!!assignmentLecture}
          onClose={() => setAssignmentLecture(null)}
        />
      )}
    </div>
  );
}
