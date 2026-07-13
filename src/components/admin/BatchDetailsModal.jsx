import { useState } from 'react';
import { Users, GraduationCap, Calendar, BarChart3, Edit, Settings } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import CreateBatchForm from './CreateBatchForm';
import BatchConfigForm from './BatchConfigForm';
import { formatDate } from '../../utils/formatters';

export default function BatchDetailsModal({ batch, onUpdate, onConfigUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!batch) return null;

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-primary)' }}>
            <Users size={20} />
            <span style={{ fontWeight: '600' }}>Students</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: 'var(--space-xs)' }}>
            {batch.studentCount || 0}
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-success)' }}>
            <GraduationCap size={20} />
            <span style={{ fontWeight: '600' }}>Teacher</span>
          </div>
          <div style={{ fontWeight: 'bold', marginTop: 'var(--space-xs)' }}>
            {batch.teacherName || 'Not Assigned'}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-accent)' }}>
            <Calendar size={20} />
            <span style={{ fontWeight: '600' }}>Timeline</span>
          </div>
          <div style={{ fontSize: '0.875rem', marginTop: 'var(--space-xs)' }}>
            <div><strong>Start:</strong> {formatDate(batch.startDate) || 'TBD'}</div>
            <div><strong>End:</strong> {formatDate(batch.endDate) || 'TBD'}</div>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--color-warning)' }}>
            <BarChart3 size={20} />
            <span style={{ fontWeight: '600' }}>Status</span>
          </div>
          <div style={{ marginTop: 'var(--space-xs)' }}>
            <Badge variant={batch.status === 'active' ? 'success' : 'neutral'} dot>
              {batch.status || 'Unknown'}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ minWidth: '500px' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-md)' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'overview' ? '600' : 'normal',
            cursor: 'pointer'
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'edit' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'edit' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'edit' ? '600' : 'normal',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Edit size={16}/> Edit</span>
        </button>
        <button
          onClick={() => setActiveTab('config')}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'config' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'config' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'config' ? '600' : 'normal',
            cursor: 'pointer'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Settings size={16}/> Marks Config</span>
        </button>
      </div>

      <div style={{ paddingTop: 'var(--space-sm)' }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'edit' && (
          <CreateBatchForm 
            batch={batch} 
            onSubmit={(data) => {
              onUpdate(data);
              setActiveTab('overview');
            }} 
            onCancel={() => setActiveTab('overview')} 
          />
        )}
        {activeTab === 'config' && (
          <BatchConfigForm 
            config={batch.config} 
            onSave={(data) => {
              onConfigUpdate(data);
              setActiveTab('overview');
            }} 
          />
        )}
      </div>
    </div>
  );
}
