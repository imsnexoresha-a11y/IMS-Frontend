import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data yet',
  message = '',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-3xl) var(--space-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
      }}
    >
      <Icon size={48} style={{ marginBottom: 'var(--space-md)', color: 'var(--color-neutral)' }} />
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
        {title}
      </h3>
      {message && (
        <p style={{ fontSize: 'var(--text-sm)', maxWidth: '360px', marginBottom: 'var(--space-lg)' }}>
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
