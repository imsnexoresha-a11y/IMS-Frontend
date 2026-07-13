import { Component } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * React Error Boundary — catches render errors in children
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message={this.state.error?.message || 'Something went wrong'}
          onRetry={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

/**
 * Error state display — used standalone or by ErrorBoundary
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
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
      }}
    >
      <AlertOctagon
        size={48}
        style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}
      />
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-xs)' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '360px', marginBottom: 'var(--space-lg)' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}
