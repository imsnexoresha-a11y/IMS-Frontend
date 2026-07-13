import { RefreshCw } from 'lucide-react';
import Button from '../common/Button';

export default function RecalculationTriggerButton({ batchName, onTrigger, loading = false }) {
  return (
    <Button variant="secondary" onClick={onTrigger} disabled={loading}>
      <RefreshCw size={16} className={loading ? 'spinning' : ''} />
      {loading ? 'Recalculating...' : `Recalculate ${batchName || 'All'}`}
    </Button>
  );
}
