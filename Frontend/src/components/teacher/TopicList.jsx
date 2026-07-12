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
import TopicForm from './TopicForm';
import TopicReorderList from './TopicReorderList';
import NotesUploadList from './NotesUploadList';

export default function TopicList({ batchId }) {
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

  if (isLoading) {
    return <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading topics...</div>;
  }

  if (isError) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--color-danger)' }}>Error loading topics.</div>;
  }

  // Check if topic is linked to any session
  const isTopicLinked = (topicId) => {
    return lectures.some(lec => lec.topicId === topicId);
  };

  const handleAddTopic = async (data) => {
    await createTopicMutation.mutateAsync({
      batchId: resolvedBatchId,
      data
    });
    setIsAddOpen(false);
  };

  const handleUpdateTopic = async (data) => {
    if (!editingTopic) return;
    await updateTopicMutation.mutateAsync({
      batchId: resolvedBatchId,
      topicId: editingTopic.id,
      data
    });
    setEditingTopic(null);
  };

  const handleDeleteTopic = async (topic) => {
    if (isTopicLinked(topic.id)) {
      alert(`Deletion Blocked: The topic "${topic.title}" is linked to an existing lecture/session.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${topic.title}"?`)) {
      await deleteTopicMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: topic.id
      });
    }
  };

  const handleReorder = async (orderedIds) => {
    await reorderTopicsMutation.mutateAsync({
      batchId: resolvedBatchId,
      orderedIds
    });
    setReorderOpen(false);
  };

  const handleUploadNotes = async (filesOrFile) => {
    if (!notesTopic || !filesOrFile) return;
    const files = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];
    if (files.length === 0) return;

    // Check maximum notes limit (5 files total)
    const currentCount = notesTopic.notesCount || notesTopic.notes?.length || 0;
    if (currentCount + files.length > 5) {
      alert(`Limit exceeded: A topic can have at most 5 notes documents. You currently have ${currentCount} and tried to upload ${files.length}.`);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('notes', file);
    });

    try {
      await uploadNotesMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: notesTopic.id,
        formData
      });
      // In order to show latest updates in the modal list
      const updated = topics.find(t => t.id === notesTopic.id);
      if (updated) {
        setNotesTopic(updated);
      }
    } catch (err) {
      alert(err.message || 'Failed to upload notes');
    }
  };

  const handleDeleteNote = async (fileId) => {
    if (!notesTopic) return;
    if (window.confirm('Delete notes document?')) {
      await deleteNoteMutation.mutateAsync({
        batchId: resolvedBatchId,
        topicId: notesTopic.id,
        fileId
      });
      // In order to show latest updates in the modal list
      const updated = topics.find(t => t.id === notesTopic.id);
      if (updated) {
        setNotesTopic(updated);
      }
    }
  };

  // Sort topics by order
  const sortedTopics = [...topics].sort(
    (a, b) => (a.orderIndex ?? a.order ?? 0) - (b.orderIndex ?? b.order ?? 0)
  );

  // Compute topic completion dynamically based on linked lecture statuses
  const isTopicCompleted = (t) => {
    const linkedSessions = lectures.filter(
      (lec) => lec.topicIds?.includes(t.id) || lec.topicId === t.id
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
            const linked = isTopicLinked(topic.id);
            const isCompleted = isTopicCompleted(topic);
            return (
              <div key={topic.id}
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
                    {topic.lectureCount || 0} lectures · {topic.notesCount || 0} notes
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
                    onClick={() => handleDeleteTopic(topic)}
                    disabled={false} // Styled differently or handled with warning alert
                    style={linked ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
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
            notes={topics.find(t => t.id === notesTopic.id)?.notes || []}
            onUpload={handleUploadNotes}
            onDeleteNote={handleDeleteNote}
            onClose={() => setNotesTopic(null)}
          />
        )}
      </Modal>
    </div>
  );
}
