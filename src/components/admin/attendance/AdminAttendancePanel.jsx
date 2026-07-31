import { AttendanceCSVUpload } from '../../teacher/AttendanceUpload';

export default function AdminAttendancePanel({
    batchId,
    lectures = [],
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <AttendanceCSVUpload batchId={batchId} />
        </div>
    );
}