import { useState, useEffect } from 'react';
import { useLectures } from '../../hooks/useLectures';
import { useUploadQuiz, useQuizResults } from '../../hooks/useQuiz';
import { useBatchStudents } from '../../hooks/useAttendance';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { FileText, Check, AlertTriangle, Award } from 'lucide-react';

export function QuizCSVUpload({ batchId, initialLectureId = '' }) {
  const resolvedBatchId = batchId || 'batch-001';

  // Queries & Mutations
  const { data: lectures = [] } = useLectures(resolvedBatchId);
  const uploadQuizMutation = useUploadQuiz();
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
  const { data: resultsData, isLoading } = useQuizResults(resolvedBatchId, selectedLectureId);
  const quizRecords = Array.isArray(resultsData)
    ? resultsData
    : (resultsData?.quiz || resultsData?.quizResults || resultsData?.results || []);

  const studentLookup = {};
  studentsData.forEach(item => {
    const s = item.student || item;
    if (s && s._id) {
      studentLookup[s._id] = s.userId?.name || s.name || '';
    }
  });

  const recordsWithNames = quizRecords.map(rec => ({
    ...rec,
    studentName: rec.studentName || studentLookup[rec.studentId] || '—'
  }));

  // Filter lectures to allow quiz uploads
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
        setImportError('JSON must be an array of student quiz records.');
        return;
      }

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        const email = item.student_email || item.email;
        if (!email) {
          setImportError(`Record ${i + 1} is missing "student_email".`);
          return;
        }
        if (item.score === undefined || item.score === null || item.score === '') {
          setImportError(`Record ${i + 1} (${email}) is missing "score".`);
          return;
        }
        const score = Number(item.score);
        if (Number.isNaN(score) || score < 0 || score > 5) {
          setImportError(`Record ${i + 1} (${email}) score "${item.score}" must be a number between 0 and 5.`);
          return;
        }
      }

      // Perform mutation
      await uploadQuizMutation.mutateAsync({
        batchId: resolvedBatchId,
        lectureId: selectedLectureId,
        quizData: { quiz: parsed }
      });

      setImportSuccess(`Successfully imported quiz results for ${parsed.length} students!`);
      setJsonText('');
    } catch (err) {
      setImportError(err.message || 'Failed to submit quiz results.');
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
          Import Quiz Scores JSON
        </h4>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
          Select a completed lecture session and submit attendance in JSON format.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', display: 'block', marginBottom: '4px' }}>
              Select Lecture Session
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
              <div style={{ display: 'flex', gap: 'var(--space-sm)', margin: 'var(--space-xs) 0' }}>
                <label style={{
                  padding: 'var(--space-xs) var(--space-sm)',
                  border: '2px solid var(--color-neutral)',
                  backgroundColor: 'var(--color-bg)',
                  fontWeight: 'var(--font-bold)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px var(--color-neutral)'
                }}>
                  📎 Choose .json File
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <Textarea
                label="Or Paste JSON Array"
                placeholder='[\n  { "student_email": "student@ims.dev", "score": 4.5 }\n]'
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                hint="Expected fields: student_email, score (0 to 5)"
              />

              <Button
                variant="primary"
                onClick={() => validateAndImport(jsonText)}
                disabled={!jsonText.trim() || uploadQuizMutation.isPending}
                fullWidth
              >
                {uploadQuizMutation.isPending ? 'Processing...' : 'Submit JSON Quiz Scores'}
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
            <Award size={18} /> Quiz Grades
          </h4>

          {isLoading ? (
            <div style={{ padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)' }}>Loading results...</div>
          ) : (
            <QuizResultTable records={recordsWithNames} />
          )}
        </div>
      )}
    </div>
  );
}

export function QuizResultTable({ records = [] }) {
  const columns = [
    { key: 'studentName', label: 'Student Name' },
    {
      key: 'score',
      label: 'Score Obtained',
      render: (v, row) => (
        <strong style={{ fontSize: 'var(--text-sm)' }}>
          {v}/{row.maxScore || 5}
        </strong>
      )
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      searchable={false}
      pageSize={10}
      searchPlaceholder="Search grades..."
    />
  );
}
