import { useState, useEffect } from 'react';
import StudentTable from '../../components/admin/StudentTable';
import BulkUploadCSVModal from '../../components/admin/BulkUploadCSVModal';
import Modal from '../../components/common/Modal';
import CreateStudentForm from '../../components/admin/CreateStudentForm';
import RecalculationTriggerButton from '../../components/admin/RecalculationTriggerButton';
import { getStudents, getBatches, getTeachers } from '../../api/adminApi';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';

export default function AdminStudents() {
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const toast = useToast();
  
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const fetchData = async () => {
    try {
      const [studentsData, batchesData, teachersData] = await Promise.all([
        getStudents(),
        getBatches(),
        getTeachers()
      ]);
      setStudents(studentsData.items || []);
      setBatches(batchesData.items || []);
      setTeachers(teachersData.items || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStudentDetails = () => {
    if (!selectedStudent) return null;
    const batch = batches.find(b => String(b.id) === String(selectedStudent.batchId));
    
    let teacherNames = 'None';
    if (batch && batch.teacherIds && batch.teacherIds.length > 0) {
      const assignedTeachers = teachers.filter(t => batch.teacherIds.includes(String(t.id)));
      if (assignedTeachers.length > 0) {
        teacherNames = assignedTeachers.map(t => t.name).join(', ');
      }
    }

    return {
      batchName: batch ? batch.name : 'Not Assigned',
      instructor: teacherNames
    };
  };

  const details = getStudentDetails();

  return (
    <div>
      <StudentTable
        students={students}
        onAdd={() => setAddModalOpen(true)}
        onBulkUpload={() => setBulkModalOpen(true)}
        onRowClick={setSelectedStudent}
      />

      <BulkUploadCSVModal
        isOpen={bulkModalOpen}
        onClose={() => { setBulkModalOpen(false); fetchData(); }}
      />

      <div style={{ marginTop: 'var(--space-md)' }}>
        <RecalculationTriggerButton 
          batchName="All Batches" 
          onTrigger={() => {}} 
        />
      </div>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Student" size="md">
        <CreateStudentForm onCancel={() => setAddModalOpen(false)} onSubmit={async (data) => { 
          try {
            await import('../../api/adminApi').then(api => api.createStudent(data));
            toast.success('Success', 'Student created successfully!');
            setAddModalOpen(false);
            fetchData();
          } catch (err) {
            toast.error('Error', err.response?.data?.message || 'Failed to create student');
          }
        }} />
      </Modal>

      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Details" size="md">
        {selectedStudent && details && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
            <Card className="student-block-hover">
              <div style={{ padding: 'var(--space-sm)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>{selectedStudent.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>{selectedStudent.email}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Assigned Batch</p>
                    <p style={{ fontWeight: '600' }}>{details.batchName}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Instructor(s)</p>
                    <p style={{ fontWeight: '600' }}>{details.instructor}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
