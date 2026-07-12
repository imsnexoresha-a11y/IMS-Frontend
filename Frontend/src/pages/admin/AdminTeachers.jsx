import { useState, useEffect } from 'react';
import TeacherTable from '../../components/admin/TeacherTable';
import EditTeacherModal from '../../components/admin/EditTeacherModal';
import { getTeachers, createTeacher, updateTeacher, getBatches, getStudents } from '../../api/adminApi';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import { useToast } from '../../components/common/Toast';

export default function AdminTeachers() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [detailsTeacher, setDetailsTeacher] = useState(null);
  const toast = useToast();
  
  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const fetchData = async () => {
    try {
      const [teachersData, batchesData, studentsData] = await Promise.all([
        getTeachers(),
        getBatches(),
        getStudents()
      ]);
      setTeachers(teachersData.items || []);
      setBatches(batchesData.items || []);
      setAllStudents(studentsData.items || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedTeacher(null);
    setEditModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setEditModalOpen(true);
  };

  const handleSave = async ({ id, data }) => {
    try {
      if (id) {
        await updateTeacher(id, data);
        toast.success('Success', 'Teacher updated successfully!');
      } else {
        await createTeacher(data);
        toast.success('Success', 'Teacher created successfully!');
      }
      fetchData();
    } catch (err) {
      console.error('Failed to save teacher', err);
      toast.error('Error', err.response?.data?.message || 'Failed to save teacher');
    }
  };

  const getTeacherDetails = () => {
    if (!detailsTeacher) return null;
    
    // Safely get assigned batches array
    const teacherBatchIds = Array.isArray(detailsTeacher.assignedBatches) 
      ? detailsTeacher.assignedBatches.map(id => String(id?.id || id?._id || id)) 
      : [];
    
    const safeBatches = Array.isArray(batches) ? batches : [];
    
    const assignedBatchesList = safeBatches.filter(b => {
      if (!b) return false;
      const batchIdStr = String(b.id || b._id);
      
      const inTeacherBatches = teacherBatchIds.includes(batchIdStr);
      
      let inBatchTeachers = false;
      if (Array.isArray(b.teacherIds)) {
        inBatchTeachers = b.teacherIds.some(tid => String(tid?.id || tid?._id || tid) === String(detailsTeacher.id));
      } else if (typeof b.teacherIds === 'string') {
        inBatchTeachers = b.teacherIds.includes(String(detailsTeacher.id));
      }
      
      return inTeacherBatches || inBatchTeachers;
    });

    const assignedBatchIds = assignedBatchesList.map(b => String(b.id || b._id));
    
    const safeStudents = Array.isArray(allStudents) ? allStudents : [];
    const studentsInBatches = safeStudents.filter(s => {
      if (!s || !s.batchId) return false;
      return assignedBatchIds.includes(String(s.batchId?.id || s.batchId?._id || s.batchId));
    });

    return {
      batchCount: assignedBatchesList.length || 0,
      batches: assignedBatchesList,
      students: studentsInBatches
    };
  };

  const details = getTeacherDetails();

  return (
    <div>
      <TeacherTable teachers={teachers || []} onAdd={handleAdd} onEdit={handleEdit} onRowClick={setDetailsTeacher} />
      <EditTeacherModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); fetchData(); }}
        teacher={selectedTeacher}
        onSave={handleSave}
      />

      <Modal isOpen={!!detailsTeacher} onClose={() => setDetailsTeacher(null)} title="Teacher Details" size="lg">
        {detailsTeacher && details && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
            <Card className="student-block-hover">
              <div style={{ padding: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <img 
                    src={detailsTeacher?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${detailsTeacher?.id || 'default'}`} 
                    alt="Avatar" 
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{detailsTeacher?.name || 'Unknown'}</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{detailsTeacher?.email || 'No email'} | {detailsTeacher?.phone || 'No phone'}</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Assigned Batches ({details?.batchCount || 0})</p>
                    {details?.batches && details.batches.length > 0 ? (
                      <ul style={{ paddingLeft: 'var(--space-md)', margin: 'var(--space-xs) 0', fontSize: 'var(--text-sm)' }}>
                        {details.batches.map((b, i) => <li key={b?.id || i}>{b?.name || 'Unnamed Batch'}</li>)}
                      </ul>
                    ) : (
                      <p style={{ fontWeight: '600' }}>None</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Total Students ({details?.students?.length || 0})</p>
                    {details?.students && details.students.length > 0 ? (
                      <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: 'var(--space-xs)', padding: 'var(--space-xs)', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                        <ul style={{ paddingLeft: 'var(--space-md)', margin: 0, fontSize: 'var(--text-sm)' }}>
                          {details.students.map((s, i) => <li key={s?.id || i}>{s?.name || 'Unknown Student'} <span style={{color: 'var(--color-text-secondary)', fontSize: '0.8em'}}>({s?.batchName || 'Unknown Batch'})</span></li>)}
                        </ul>
                      </div>
                    ) : (
                      <p style={{ fontWeight: '600' }}>No students</p>
                    )}
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
