import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, ExternalLink, FileText, Check, AlertTriangle, Award, Upload } from 'lucide-react';
import { useLectures } from '../../hooks/useLectures';
import { useTopics } from '../../hooks/useTopics';
import { useUploadQuiz, useQuizResults } from '../../hooks/useQuiz';
import { useBatchStudents } from '../../hooks/useAttendance';
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import TemplateDownloadButton from '../common/TemplateDownloadButton';
import apiClient from '../../api/apiClient';

function TeacherQuizForm({ topics = [], lectures = [], onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      topicId: '',
      lectureId: '',
      source: 'google_forms',
      externalUrl: '',
      maxScore: 100,
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Input
        label="Quiz Title"
        name="title"
        required
        error={errors.title?.message}
        {...register('title', { required: 'Quiz title is required' })}
      />

      <Select
        label="Topic"
        name="topicId"
        options={[
          { value: '', label: 'Select topic' },
          ...topics.map((t) => ({ value: t._id || t.id, label: t.title })),
        ]}
        error={errors.topicId?.message}
        {...register('topicId', { required: 'Topic is required' })}
      />

      <Select
        label="Lecture Session"
        name="lectureId"
        required
        options={[
          { value: '', label: 'Select lecture session' },
          ...lectures.map((l) => ({ value: l._id || l.id, label: l.title })),
        ]}
        error={errors.lectureId?.message}
        {...register('lectureId', { required: 'Lecture session is required' })}
      />

      <Select
        label="Quiz Platform"
        name="source"
        options={[
          { value: 'google_forms', label: 'Google Forms' },
          { value: 'kahoot', label: 'Kahoot' },
          { value: 'internal', label: 'Internal Quiz' },
        ]}
        {...register('source')}
      />

      <Input
        label="Quiz Link / URL"
        name="externalUrl"
        type="url"
        placeholder="https://forms.google.com/..."
        {...register('externalUrl')}
      />

      <Input
        label="Maximum Score"
        name="maxScore"
        type="number"
        min="1"
        required
        error={errors.maxScore?.message}
        {...register('maxScore', { required: 'Maximum score is required' })}
      />

      <Textarea
        label="Description (Optional)"
        name="description"
        rows={3}
        {...register('description')}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Create Quiz</Button>
      </div>
    </form>
  );
}

export function QuizCSVUpload({ batchId, initialLectureId = '' }) {
  const resolvedBatchId = batchId || 'batch-001';

  // Queries & Data
  const { data: lectures = [] } = useLectures(resolvedBatchId);
  const { data: topics = [] } = useTopics(resolvedBatchId);
  const uploadQuizMutation = useUploadQuiz();
  const { data: studentsData = [] } = useBatchStudents(resolvedBatchId);

  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const [selectedLectureId, setSelectedLectureId] = useState(initialLectureId);
  const [jsonText, setJsonText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  const loadQuizzes = async () => {
    setQuizzesLoading(true);
    try {
      const res = await apiClient.get('/quizzes').catch(() => []);
      const list = Array.isArray(res) ? res : (res.quizzes || res.data || []);
      const filtered = list.filter((q) => !q.batchId || String(q.batchId) === String(resolvedBatchId));
      setQuizzes(filtered.map((q) => ({
        ...q,
        id: q._id || q.id,
        title: q.title || 'Untitled Quiz',
        totalMarks: q.totalMarks || q.maxScore || 100,
      })));
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    } finally {
      setQuizzesLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [resolvedBatchId]);

  useEffect(() => {
    if (initialLectureId) {
      setSelectedLectureId(initialLectureId);
    }
  }, [initialLectureId]);

  const handleCreateQuizSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        batchId: resolvedBatchId,
        sessionId: formData.lectureId || formData.topicId || `sess-${Date.now()}`,
        link: formData.externalUrl || '',
        totalMarks: Number(formData.maxScore || 100),
        passingMarks: Math.round(Number(formData.maxScore || 100) * 0.4),
        totaldurationInMins: 30,
        source: formData.source || 'google_forms',
        description: formData.description || '',
      };
      await apiClient.post('/quizzes', payload);
      setCreateModalOpen(false);
      loadQuizzes();
    } catch (err) {
      alert(err?.message || 'Failed to create quiz');
    }
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    try {
      await apiClient.delete(`/quizzes/${quizToDelete.id}`);
      setQuizToDelete(null);
      loadQuizzes();
    } catch (err) {
      alert(err?.message || 'Failed to delete quiz');
      setQuizToDelete(null);
    }
  };

  // Fetch results when a lecture is selected
  const { data: resultsData, isLoading } = useQuizResults(resolvedBatchId, selectedLectureId);
  const quizRecords = Array.isArray(resultsData)
    ? resultsData
    : (resultsData?.quiz || resultsData?.quizResults || resultsData?.results || []);

  const studentLookup = {};
  studentsData.forEach((item) => {
    const s = item.student || item;
    if (s && s._id) {
      studentLookup[s._id] = s.userId?.name || s.name || '';
    }
  });

  const recordsWithNames = quizRecords.map((rec) => ({
    ...rec,
    studentName: rec.studentName || studentLookup[rec.studentId] || '—',
  }));

  const uploadableLectures = lectures.filter((l) => l.status === 'completed');

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

      await uploadQuizMutation.mutateAsync({
        batchId: resolvedBatchId,
        lectureId: selectedLectureId,
        quizData: { quiz: parsed },
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
    e.target.value = '';
  };

  const quizColumns = [
    { key: 'title', label: 'Quiz Title', render: (v) => <strong>{v}</strong> },
    {
      key: 'source',
      label: 'Platform',
      render: (v) => (
        <Badge variant="info">
          {typeof v === 'string' ? v.replace(/_/g, ' ') : (v || 'quiz')}
        </Badge>
      ),
    },
    {
      key: 'link',
      label: 'Link',
      render: (v, row) => {
        const url = v || row.externalUrl;
        return url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent)', fontWeight: 'var(--font-bold)' }}>
            <ExternalLink size={14} /> Open Quiz
          </a>
        ) : '—';
      },
    },
    { key: 'totalMarks', label: 'Max Score', render: (v) => <strong>{v}</strong> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const matchingLecture = lectures.find((l) => String(l.id || l._id) === String(row.sessionId || row.lectureId));
              if (matchingLecture) {
                setSelectedLectureId(matchingLecture.id || matchingLecture._id);
              }
            }}
          >
            Upload Scores
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setQuizToDelete(row)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Quiz List & Create Section */}
      <div style={{
        padding: 'var(--space-md)',
        border: '3px solid var(--color-neutral)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-offset)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <div>
            <h3 style={{ fontWeight: 'var(--font-black)', fontSize: 'var(--text-lg)' }}>Quizzes</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Create new quizzes or manage existing batch quizzes.
            </p>
          </div>
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} /> Create Quiz
          </Button>
        </div>

        {quizzesLoading ? (
          <div style={{ padding: 'var(--space-md)', textAlign: 'center' }}>Loading quizzes...</div>
        ) : (
          <DataTable columns={quizColumns} data={quizzes} searchPlaceholder="Search quizzes..." pageSize={5} />
        )}
      </div>

      {/* JSON Import Section */}
      <div style={{
        padding: 'var(--space-md)',
        border: '3px solid var(--color-neutral)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-offset)',
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
                cursor: 'pointer',
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
                  margin: 0,
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
                  templateKey="quiz"
                  variant="secondary"
                  size="sm"
                  label="Download Template JSON"
                />
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
              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)',
            }}>
              <AlertTriangle size={16} /> {importError}
            </div>
          )}

          {importSuccess && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-xs)',
              padding: 'var(--space-xs)', border: '2px solid var(--color-neutral)',
              backgroundColor: 'var(--color-success-light, #e6ffed)', color: 'var(--color-success, #28a745)',
              fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)',
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
          boxShadow: 'var(--shadow-offset)',
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

      {/* Create Quiz Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Quiz" size="md">
        <TeacherQuizForm
          topics={topics}
          lectures={lectures}
          onSubmit={handleCreateQuizSubmit}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!quizToDelete}
        onClose={() => setQuizToDelete(null)}
        onConfirm={handleDeleteQuiz}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${quizToDelete?.title}"?`}
        confirmLabel="Delete"
        variant="danger"
      />
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
      ),
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
