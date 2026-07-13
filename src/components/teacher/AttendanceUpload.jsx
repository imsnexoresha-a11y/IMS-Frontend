import { useState, useEffect } from 'react';
import { useLectures } from '../../hooks/useLectures';
import { useUploadAttendance, useAttendanceResults, useBatchStudents } from '../../hooks/useAttendance';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { FileText, Check, AlertTriangle, Users } from 'lucide-react';
import TemplateDownloadButton from '../common/TemplateDownloadButton';

const STATUS_VARIANTS = { present: 'success', absent: 'error', late: 'warning', excused: 'info', half: 'warning' };

export function AttendanceCSVUpload({ batchId, initialLectureId = '' }) {
  const resolvedBatchId = batchId || 'batch-001';

  // Queries & Mutations
  const { data: lectures = [] } = useLectures(resolvedBatchId);
  const uploadAttendanceMutation = useUploadAttendance();
  const { data: studentsData = [] } = useBatchStudents(resolvedBatchId);

  const [selectedLectureId, setSelectedLectureId] = useState(initialLectureId);
  const [jsonText, setJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  useEffect(() => {
    if (initialLectureId) {
      setSelectedLectureId(initialLectureId);
    }
  }, [initialLectureId]);

  // Fetch results when a lecture is selected
  const { data: resultsData, isLoading } = useAttendanceResults(resolvedBatchId, selectedLectureId);
  const attendanceRecords = Array.isArray(resultsData)
    ? resultsData
    : (resultsData?.attendance || resultsData?.results || []);

  const studentLookup = {};
  studentsData.forEach(item => {
    const s = item.student || item;
    if (s && s._id) {
      studentLookup[s._id] = s.userId?.name || s.name || '';
    }
  });

  const recordsWithNames = attendanceRecords.map(rec => ({
    ...rec,
    studentName: rec.studentName || studentLookup[rec.studentId] || '—'
  }));

  // Filter lectures to only allow uploads for completed lectures
  const uploadableLectures = lectures.filter(
    (l) => l.status === 'completed'
  );

  const validateAndImport = async (rawString) => {
    setImportError('');
    setImportSuccess('');

    if (!selectedLectureId) {
      setImportError('Please select a lecture session first.');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(rawString);
    } catch (e) {
      setImportError('Invalid JSON format. Please verify syntax.');
      return;
    }

    try {
      // Validation checks
      if (!parsed || !Array.isArray(parsed)) {
        setImportError('JSON must be an array of student attendance records.');
        return;
      }

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        const email = item.student_email || item.email;
        if (!email) {
          setImportError(`Record ${i + 1} is missing "student_email".`);
          return;
        }
        if (typeof item.first_half !== 'boolean' || typeof item.second_half !== 'boolean') {
          setImportError(`Record ${i + 1} (${email}) must contain boolean "first_half" and "second_half" values.`);
          return;
        }
      }

      // Perform mutation
      await uploadAttendanceMutation.mutateAsync({
        batchId: resolvedBatchId,
        lectureId: selectedLectureId,
        attendanceData: { attendance: parsed }
      });

      setImportSuccess(`Successfully imported attendance for ${parsed.length} students!`);
      setJsonText('');
    } catch (err) {
      setImportError(err.message || 'Failed to submit attendance.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      validateAndImport(event.target?.result || '');
    };
    reader.readAsText(file);
    e.target.value = ''; // clear input
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{
        padding: 'var(--space-md)',
        border: '3px solid var(--color-neutral)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-offset)'
      }}>
        <h4 style={{ fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xs)', fontSize: 'var(--text-md)' }}>
          Import Attendance JSON
        </h4>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
          Select a completed lecture session and submit attendance in JSON format.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', display: 'block', marginBottom: '4px' }}>
              Select Lecture
            </label>
            <select
              value={selectedLectureId}
              onChange={(e) => {
                setSelectedLectureId(e.target.value);
                setImportError('');
                setImportSuccess('');
              }}
              style={{
                width: '100%',
                padding: 'var(--space-xs) var(--space-sm)',
                border: '2px solid var(--color-neutral)',
                backgroundColor: 'var(--color-surface)',
                fontFamily: 'inherit',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Choose Lecture --</option>
              {uploadableLectures.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({new Date(l.date || l.sessionDateAndTime).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {selectedLectureId && (
            <>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', margin: 'var(--space-xs) 0', alignItems: 'center' }}>
                <label style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  border: '2px solid var(--color-neutral)',
                  backgroundColor: 'var(--color-bg)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px var(--color-neutral)',
                  margin: 0
                }}>
                  📎 Choose .json File
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <TemplateDownloadButton
                  templateKey="teacherAttendance"
                  variant="secondary"
                  size="sm"
                  label="Download Template JSON"
                />
              </div>

              <Textarea
                label="Or Paste JSON Array"
                placeholder='[\n  { "student_email": "student@ims.dev", "first_half": true, "second_half": true }\n]'
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                hint="Expected fields: student_email, first_half, second_half"
              />

              <Button
                variant="primary"
                onClick={() => validateAndImport(jsonText)}
                disabled={!jsonText.trim() || uploadAttendanceMutation.isPending}
                fullWidth
              >
                {uploadAttendanceMutation.isPending ? 'Processing...' : 'Submit JSON Attendance'}
              </Button>
            </>
          )}

          {importError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
              padding: 'var(--space-xs)', border: '2px solid var(--color-neutral)',
              backgroundColor: 'var(--color-danger-light, #ffebe9)', color: 'var(--color-danger, #d73a49)',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)'
            }}>
              <AlertTriangle size={16} /> {importError}
            </div>
          )}

          {importSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
              padding: 'var(--space-xs)', border: '2px solid var(--color-neutral)',
              backgroundColor: 'var(--color-success-light, #e6ffed)', color: 'var(--color-success, #28a745)',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)'
            }}>
              <Check size={16} /> {importSuccess}
            </div>
          )}
        </div>
      </div>

      {selectedLectureId && (
        <div style={{
          padding: 'var(--space-md)',
          border: '3px solid var(--color-neutral)',
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-offset)'
        }}>
          <h4 style={{ fontWeight: 'var(--font-black)', marginBottom: 'var(--space-sm)', fontSize: 'var(--text-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <Users size={18} /> Attendance Records
          </h4>

          {isLoading ? (
            <div style={{ padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)' }}>Loading records...</div>
          ) : (
            <AttendanceResultTable records={recordsWithNames} />
          )}
        </div>
      )}
    </div>
  );
}

export function AttendanceResultTable({ records = [] }) {
  const columns = [
    { key: 'studentName', label: 'Student Name' },
    {
      key: 'status',
      label: 'Attendance Status',
      render: (v) => (
        <Badge variant={STATUS_VARIANTS[v] || 'neutral'} dot>
          {v.toUpperCase()}
        </Badge>
      )
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      searchable={false}
      pageSize={10}
      searchPlaceholder="Search records..."
    />
  );
}
