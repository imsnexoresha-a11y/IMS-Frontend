import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';

import MarkOverrideForm from '../../components/admin/MarkOverrideForm';
import EventCorrectionForm from '../../components/admin/EventCorrectionForm';
import ManualScoreEntryForm from '../../components/admin/ManualScoreEntryForm';

export default function AdminMarks() {
  const [activeTab, setActiveTab] = useState('override');
  const toast = useToast();

  const handleSuccess = (message) => {
    toast.success('Success', message);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', borderBottom: '2px solid var(--color-neutral)', paddingBottom: 'var(--space-sm)' }}>
        <Button 
          variant={activeTab === 'override' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('override')}
        >
          Mark Override
        </Button>
        <Button 
          variant={activeTab === 'event' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('event')}
        >
          Event Correction
        </Button>
        <Button 
          variant={activeTab === 'manual' ? 'primary' : 'outline'} 
          onClick={() => setActiveTab('manual')}
        >
          Manual Score Entry
        </Button>
      </div>

      <Card title={
        activeTab === 'override' ? 'Override Student Marks' :
        activeTab === 'event' ? 'Correct Ledger Event' :
        'Add Manual Score'
      } className="card-3d-tilt">
        
        {activeTab === 'override' && (
          <MarkOverrideForm 
            onSubmit={(data) => handleSuccess(`Mark overridden successfully for Student ID: ${data.studentId}`)} 
            onCancel={() => {}} 
          />
        )}
        
        {activeTab === 'event' && (
          <EventCorrectionForm 
            onSubmit={(data) => handleSuccess(`Ledger event corrected (Event ID: ${data.eventId})`)} 
            onCancel={() => {}} 
          />
        )}
        
        {activeTab === 'manual' && (
          <ManualScoreEntryForm 
            onSubmit={(data) => handleSuccess(`Manual score of ${data.score} added for Student ID: ${data.studentId}`)} 
            onCancel={() => {}} 
          />
        )}

      </Card>
    </div>
  );
}
