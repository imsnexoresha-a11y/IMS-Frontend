import { useState } from 'react';
import { Link2, Copy, Trash2, Plus } from 'lucide-react';

import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export default function RecruiterLinkManager() {
  const [links] = useState([]);

  const copyLink = (uuid) => {
    navigator.clipboard?.writeText(`${window.location.origin}/recruiter/${uuid}`);
  };

  return (
    <Card title="Recruiter Links" headerAction={<Button variant="primary" size="sm"><Plus size={16} /> Generate Link</Button>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {links.map((link) => (
          <div key={link.id} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)', border: '2px solid var(--color-neutral)',
          }}>
            <Link2 size={18} style={{ color: 'var(--color-accent)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>{link.batchName}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                Created {formatDate(link.createdAt)} · {link.accessCount} views
              </div>
            </div>
            <Badge variant={link.active ? 'success' : 'error'} dot>{link.active ? 'Active' : 'Revoked'}</Badge>
            <Button variant="ghost" size="sm" onClick={() => copyLink(link.uuid)}><Copy size={14} /></Button>
            <Button variant="ghost" size="sm"><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
