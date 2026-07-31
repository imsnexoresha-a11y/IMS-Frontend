import { useState } from 'react';
import { BookOpen, Check, Edit, Trash2, Paperclip, ArrowUpDown, Plus } from 'lucide-react';
import {
  useTopics,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
  useReorderTopics,
  useUploadTopicNotes,
  useDeleteTopicNote
} from '../../hooks/useTopics';
import { useLectures } from '../../hooks/useLectures';
import Badge from '../common/Badge';
import Button, { IconButton } from '../common/Button';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../common/Toast';
import TopicForm from './TopicForm';
import TopicReorderList from './TopicReorderList';
import NotesUploadList from './NotesUploadList';

function getTopicId(topic) {
  return topic?._id || topic?.id || '';
}

export default function TopicList({ batchId }) {
  const toast = useToast();
  const resolvedBatchId = batchId || 'batch-001';

  // React Queries
  const { data: topics = [], isLoading, isError } = useTopics(resolvedBatchId);
  const { data: lectures = [] } = useLectures(resolvedBatchId);

  // Mutations
  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  const deleteTopicMutation = useDeleteTopic();
  const reorderTopicsMutation = useReorderTopics();
  const uploadNotesMutation = useUploadTopicNotes();
  const deleteNoteMutation = useDeleteTopicNote();

  // Modals Local State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [notesTopic, setNotesTopic] = useState(null);

  // Deletion Modal State
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [blockedTopic, setBlockedTopic] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  if (isLoading) {
    return <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading topics...</div>;
  }

  if (isError) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--color-danger)' }}>Error loading topics.</div>;
  }

  // Check if topic is linked to any session
  const isTopicLinked = (topicId) => {
    if (!topicId) return false;
    return lectures.some(lec => {
      if (lec.topicId === topicId) return true;
      if (Array.isArray(lec.topicIds) && lec.topicIds.includes(topicId)) return true;
      return false;
    });
  };

  const handleAddTopic = async (data) => {
    try {
      await createTopicMutation.mutateAsync({
        batchId: resolvedBatchId,
        data
      });
      toast.success('Topic Created', 'Curriculum topic created successfully.');
      setIsAddOpen(false);
    } catch (err) {
      toast.error('Creation Failed', err.message || 'Failed to create topic');
    }
  };

  const handleUpdateTopic = async (data) => {
    const tid = getTopicId(editingTopic);
    if (!tid) return;
    try {
      await updateTopicMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: tid,
        data
      });
      toast.success('Topic Updated', 'Curriculum topic updated successfully.');
      setEditingTopic(null);
    } catch (err) {
      toast.error('Update Failed', err.message || 'Failed to update topic');
    }
  };

  const onClickDeleteTopic = (topic) => {
    const tid = getTopicId(topic);
    if (isTopicLinked(tid)) {
      setBlockedTopic(topic);
    } else {
      setTopicToDelete(topic);
    }
  };

  const executeDeleteTopic = async () => {
    if (!topicToDelete) return;
    const tid = getTopicId(topicToDelete);
    try {
      await deleteTopicMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: tid
      });
      toast.success('Topic Deleted', `"${topicToDelete.title}" deleted successfully.`);
      setTopicToDelete(null);
    } catch (err) {
      toast.error('Delete Failed', err.message || 'Failed to delete topic');
    }
  };

  const handleReorder = async (orderedIds) => {
    try {
      await reorderTopicsMutation.mutateAsync({
        batchId: resolvedBatchId,
        orderedIds
      });
      toast.success('Topics Reordered', 'Topic order updated successfully.');
      setReorderOpen(false);
    } catch (err) {
      toast.error('Reorder Failed', err.message || 'Failed to reorder topics');
    }
  };

  const handleUploadNotes = async (filesOrFile) => {
    const tid = getTopicId(notesTopic);
    if (!tid || !filesOrFile) return;
    const files = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];
    if (files.length === 0) return;

    const currentCount = notesTopic.notesCount || notesTopic.notes?.length || 0;
    if (currentCount + files.length > 5) {
      toast.warning('Limit Exceeded', `A topic can have at most 5 notes documents. (Current: ${currentCount})`);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('notes', file);
    });

    try {
      await uploadNotesMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: tid,
        formData
      });
      toast.success('Notes Uploaded', 'Study materials uploaded successfully.');
      const updated = topics.find(t => getTopicId(t) === tid);
      if (updated) {
        setNotesTopic(updated);
      }
    } catch (err) {
      toast.error('Upload Failed', err.message || 'Failed to upload notes');
    }
  };

  const onClickDeleteNote = (fileId) => {
    setNoteToDelete(fileId);
  };

  const executeDeleteNote = async () => {
    const tid = getTopicId(notesTopic);
    if (!tid || !noteToDelete) return;
    try {
      await deleteNoteMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: tid,
        fileId: noteToDelete
      });
      toast.success('File Deleted', 'Notes document deleted successfully.');
      const updated = topics.find(t => getTopicId(t) === tid);
      if (updated) {
        setNotesTopic(updated);
      }
      setNoteToDelete(null);
    } catch (err) {
      toast.error('Delete Failed', err.message || 'Failed to delete note');
    }
  };

  // Sort topics by order
  const sortedTopics = [...topics].sort(
    (a, b) => (a.orderIndex ?? a.order ?? 0) - (b.orderIndex ?? b.order ?? 0)
  );

  // Compute topic completion dynamically based on linked lecture statuses
  const isTopicCompleted = (t) => {
    const tid = getTopicId(t);
    const linkedSessions = lectures.filter(
      (lec) => lec.topicIds?.includes(tid) || lec.topicId === tid
    );
    if (linkedSessions.length === 0) return false;
    return linkedSessions.every((lec) => lec.status === 'completed');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Topics & Materials</h3>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <Button variant="outline" size="sm" onClick={() => setReorderOpen(true)}>
            <ArrowUpDown size={16} style={{ marginRight: '4px' }} /> Reorder
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus size={16} style={{ marginRight: '4px' }} /> Add Topic
          </Button>
        </div>
      </div>

      {sortedTopics.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 'var(--space-xl)',
          border: '3px solid var(--color-neutral)', backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-secondary)', fontWeight: 'var(--font-semibold)'
        }}>
          No curriculum topics created yet. Click "Add Topic" to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {sortedTopics.map((topic) => {
            const tid = getTopicId(topic);
            const linked = isTopicLinked(tid);
            const isCompleted = isTopicCompleted(topic);
            const linkedLecs = lectures.filter(
              (lec) => lec.topicId === tid || (Array.isArray(lec.topicIds) && lec.topicIds.includes(tid))
            );
            const lectureCount = (typeof topic.lectureCount === 'number' && topic.lectureCount > 0)
              ? topic.lectureCount
              : linkedLecs.length;
            const notesCount = (typeof topic.notesCount === 'number' && topic.notesCount > 0)
              ? topic.notesCount
              : (topic.notesFiles?.length || topic.notes?.length || 0);

            return (
              <div key={tid}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                  padding: 'var(--space-md) var(--space-lg)',
                  border: 'var(--border-width) solid var(--border-color)',
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-offset)',
                  position: 'relative'
                }}
              >
                <span style={{ fontWeight: 'var(--font-black)', color: 'var(--color-accent)', minWidth: '24px', fontSize: 'var(--text-md)' }}>
                  {(topic.orderIndex ?? topic.order ?? 0) + 1}.
                </span>
                
                <BookOpen size={20} style={{ color: 'var(--color-neutral)' }} />
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'var(--font-black)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                    {topic.title}
                  </div>
                  {topic.description && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {topic.description}
                    </div>
                  )}
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral)', fontWeight: 'var(--font-bold)', marginTop: '4px' }}>
                    {lectureCount} {lectureCount === 1 ? 'lecture' : 'lectures'} · {notesCount} {notesCount === 1 ? 'note' : 'notes'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                  {isCompleted ? (
                    <Badge variant="success"><Check size={12} style={{ marginRight: '2px' }} /> Done</Badge>
                  ) : (
                    <Badge variant="neutral">In Progress</Badge>
                  )}
                  
                  <IconButton
                    icon={Paperclip}
                    size="sm"
                    label="Manage Notes"
                    onClick={() => setNotesTopic(topic)}
                  />
                  
                  <IconButton
                    icon={Edit}
                    size="sm"
                    label="Edit Topic"
                    onClick={() => setEditingTopic(topic)}
                  />
                  
                  <IconButton
                    icon={Trash2}
                    size="sm"
                    variant="danger"
                    label={linked ? "Deletion Blocked (Linked to Lecture)" : "Delete Topic"}
                    onClick={() => onClickDeleteTopic(topic)}
                    style={linked ? { opacity: 0.5 } : {}}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Topic Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Curriculum Topic">
        <TopicForm onSubmit={handleAddTopic} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      {/* Edit Topic Modal */}
      <Modal isOpen={!!editingTopic} onClose={() => setEditingTopic(null)} title="Edit Curriculum Topic">
        {editingTopic && (
          <TopicForm
            defaultValues={{
              title: editingTopic.title,
              description: editingTopic.description || '',
              estimatedHours: editingTopic.estimatedHours || 0,
              learningObjectives: editingTopic.learningObjectives || []
            }}
            onSubmit={handleUpdateTopic}
            onCancel={() => setEditingTopic(null)}
          />
        )}
      </Modal>

      {/* Reorder Topics Modal */}
      <Modal isOpen={reorderOpen} onClose={() => setReorderOpen(false)} title="Reorder Curriculum Topics">
        <TopicReorderList topics={topics} onReorder={handleReorder} />
      </Modal>

      {/* Manage Notes Modal */}
      <Modal isOpen={!!notesTopic} onClose={() => setNotesTopic(null)} title="Topic Learning Materials">
        {notesTopic && (
          <NotesUploadList
            topicTitle={notesTopic.title}
            notes={topics.find(t => getTopicId(t) === getTopicId(notesTopic))?.notes || []}
            onUpload={handleUploadNotes}
            onDeleteNote={onClickDeleteNote}
            onClose={() => setNotesTopic(null)}
          />
        )}
      </Modal>

      {/* Delete Topic Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(topicToDelete)}
        onClose={() => setTopicToDelete(null)}
        onConfirm={executeDeleteTopic}
        title="Delete Curriculum Topic"
        message={`Are you sure you want to delete "${topicToDelete?.title}"? This action will remove the topic from the curriculum.`}
        confirmLabel="Delete Topic"
        variant="danger"
        loading={deleteTopicMutation.isPending}
      />

      {/* Deletion Blocked Alert Modal */}
      <Modal
        isOpen={Boolean(blockedTopic)}
        onClose={() => setBlockedTopic(null)}
        title="Deletion Blocked"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <p style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            The topic <strong>"{blockedTopic?.title}"</strong> cannot be deleted because it is currently linked to one or more scheduled/completed lectures.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Please remove or reassign the topic from its linked lectures before deleting it.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
            <Button variant="primary" onClick={() => setBlockedTopic(null)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Note Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={executeDeleteNote}
        title="Delete Document"
        message="Are you sure you want to delete this notes document? This action cannot be undone."
        confirmLabel="Delete File"
        variant="danger"
        loading={deleteNoteMutation.isPending}
      />
    </div>
  );
}
