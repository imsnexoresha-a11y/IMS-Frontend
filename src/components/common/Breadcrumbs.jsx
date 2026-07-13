import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [], className = '' }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-lg)',
      }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            {isLast ? (
              <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-ink)' }}>
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.path}
                  style={{
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--color-text-secondary)')}
                >
                  {item.label}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
