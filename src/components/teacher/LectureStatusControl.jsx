import { LECTURE_STATUS } from '../../utils/constants';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Play, CheckCircle, XCircle } from 'lucide-react';

const TRANSITIONS = {
  scheduled: [
    { to: 'in_progress', label: 'Start', icon: Play, variant: 'primary' },
    { to: 'postponed', label: 'Postpone', icon: XCircle, variant: 'warning' },
    { to: 'cancelled', label: 'Cancel', icon: XCircle, variant: 'danger' },
  ],
  postponed: [
    { to: 'scheduled', label: 'Reschedule', icon: Play, variant: 'primary' },
    { to: 'in_progress', label: 'Start', icon: Play, variant: 'secondary' },
    { to: 'cancelled', label: 'Cancel', icon: XCircle, variant: 'danger' },
  ],
  in_progress: [
    { to: 'completed', label: 'Complete', icon: CheckCircle, variant: 'primary' },
    { to: 'cancelled', label: 'Cancel', icon: XCircle, variant: 'danger' },
  ],
  completed: [],
  cancelled: [],
};

const STATUS_VARIANTS = { scheduled: 'info', in_progress: 'warning', completed: 'success', cancelled: 'error', postponed: 'neutral' };

export default function LectureStatusControl({ status, lectureDate, endTime, onStatusChange }) {
  const transitions = TRANSITIONS[status] || [];

  // Determine end time of the lecture
  let end = null;
  if (lectureDate) {
    if (endTime) {
      const datePart = new Date(lectureDate).toISOString().split('T')[0];
      end = new Date(`${datePart}T${endTime}:00`);
    } else {
      // Default to 2 hours after lecture start
      end = new Date(new Date(lectureDate).getTime() + 2 * 60 * 60 * 1000);
    }
  }

  const isBeforeEnd = end ? new Date() < end : false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <Badge variant={STATUS_VARIANTS[status] || 'neutral'} dot>
          {status?.replace('_', ' ')}
        </Badge>
        {transitions.map((t) => {
          const isDisabled = t.to === 'completed' && isBeforeEnd;
          return (
            <Button
              key={t.to}
              variant={t.variant}
              size="sm"
              onClick={() => onStatusChange?.(t.to)}
              disabled={isDisabled}
              title={isDisabled ? "Cannot complete lecture before its scheduled end time" : t.label}
            >
              <t.icon size={14} /> {t.label}
            </Button>
          );
        })}
      </div>
      {status === 'in_progress' && isBeforeEnd && (
        <span style={{ fontSize: 'var(--text-xxs)', color: 'var(--color-danger)', fontWeight: 'var(--font-bold)' }}>
          * Complete button disabled until scheduled end: {end ? end.toLocaleTimeString() : ''}
        </span>
      )}
    </div>
  );
}

