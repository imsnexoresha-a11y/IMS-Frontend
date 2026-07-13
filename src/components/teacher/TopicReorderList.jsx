import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, GripVertical, Check } from 'lucide-react';
import Button, { IconButton } from '../common/Button';

export default function TopicReorderList({ topics = [], onReorder }) {
  const [localTopics, setLocalTopics] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Sort by order or order_index
    const sorted = [...topics].sort((a, b) => (a.order || 0) - (b.order || 0));
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

  const handleSave = () => {
    onReorder?.(localTopics.map((t) => t.id));
    setHasChanges(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {localTopics.map((topic, i) => (
          <div key={topic.id} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-md)', border: '2px solid var(--color-neutral)',
            backgroundColor: 'var(--color-surface)',
            boxShadow: '2px 2px 0px var(--color-neutral)'
          }}>
            <GripVertical size={16} style={{ color: 'var(--color-neutral)' }} />
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
