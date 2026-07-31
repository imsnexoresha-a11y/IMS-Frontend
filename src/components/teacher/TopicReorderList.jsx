import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, GripVertical, Check } from 'lucide-react';
import Button, { IconButton } from '../common/Button';

export default function TopicReorderList({ topics = [], onReorder }) {
  const [localTopics, setLocalTopics] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    // Sort by order or orderIndex
    const sorted = [...topics].sort((a, b) => (a.orderIndex ?? a.order ?? 0) - (b.orderIndex ?? b.order ?? 0));
    setLocalTopics(sorted);
    setHasChanges(false);
  }, [topics]);

  const moveUp = (index) => {
    if (index <= 0) return;
    const reordered = [...localTopics];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    setLocalTopics(reordered);
    setHasChanges(true);
  };

  const moveDown = (index) => {
    if (index >= localTopics.length - 1) return;
    const reordered = [...localTopics];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    setLocalTopics(reordered);
    setHasChanges(true);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...localTopics];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setLocalTopics(updated);
    setHasChanges(true);
    setDraggedIndex(null);
  };

  const handleSave = () => {
    onReorder?.(localTopics.map((t) => t._id || t.id));
    setHasChanges(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0 }}>
        💡 Drag and drop items using the handle handle or click arrow buttons to adjust topic sequence.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {localTopics.map((topic, i) => (
          <div
            key={topic._id || topic.id || i}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={() => setDraggedIndex(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-md)', border: '2px solid var(--color-neutral)',
              backgroundColor: draggedIndex === i ? 'var(--color-bg)' : 'var(--color-surface)',
              opacity: draggedIndex === i ? 0.5 : 1,
              boxShadow: '2px 2px 0px var(--color-neutral)',
              cursor: 'grab',
              userSelect: 'none'
            }}
          >
            <GripVertical size={16} style={{ color: 'var(--color-text-secondary)', cursor: 'grab' }} />
            <span style={{ fontWeight: 'var(--font-black)', color: 'var(--color-accent)', minWidth: '20px' }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{topic.title}</span>
            <IconButton icon={ArrowUp} size="sm" label="Move up" onClick={() => moveUp(i)} disabled={i === 0} />
            <IconButton icon={ArrowDown} size="sm" label="Move down" onClick={() => moveDown(i)} disabled={i === localTopics.length - 1} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xs)' }}>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!hasChanges}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
        >
          <Check size={16} /> Save New Order
        </Button>
      </div>
    </div>
  );
}
