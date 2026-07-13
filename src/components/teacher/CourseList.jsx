import { useState } from 'react';
import { BookOpen, Plus, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as teacherApi from '../../api/teacherApi';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';

export default function CourseList({ batchId }) {
  const resolvedBatchId = batchId || 'batch-001';
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses
  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: teacherApi.getCourses,
  });

  // Filter courses for the active batch
  const batchCourses = courses.filter((c) => c.batchId === resolvedBatchId);

  // Mutation for creating course
  const createCourseMutation = useMutation({
    mutationFn: (data) => teacherApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    setIsSubmitting(true);
    try {
      await createCourseMutation.mutateAsync({
        name: courseName,
        batchId: resolvedBatchId,
      });
      setIsAddOpen(false);
      setCourseName('');
    } catch (err) {
      alert(err.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>Loading courses...</div>;
  }

  if (isError) {
    return <div style={{ padding: 'var(--space-lg)', color: 'var(--color-danger)' }}>Error loading courses.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Available Courses</h3>
        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus size={16} style={{ marginRight: '4px' }} /> Add Course
        </Button>
      </div>

      {batchCourses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 'var(--space-xl)',
          border: '3px solid var(--color-neutral)', backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-secondary)', fontWeight: 'var(--font-semibold)'
        }}>
          No courses created for this batch yet. Click "Add Course" to get started.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          {batchCourses.map((course) => (
            <div key={course._id || course.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-md) var(--space-lg)',
                border: 'var(--border-width) solid var(--border-color)',
                backgroundColor: 'var(--color-surface)',
                boxShadow: 'var(--shadow-offset)',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px', backgroundColor: 'var(--color-bg)',
                border: '2px solid var(--color-neutral)', borderRadius: '4px'
              }}>
                <Award size={20} style={{ color: 'var(--color-accent)' }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'var(--font-black)', fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>
                  {course.name}
                </div>
                <div style={{ fontSize: 'var(--text-xxs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  ID: {course._id || course.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Course">
        <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
          <Input
            label="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Database Administration"
            required
            autoFocus
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
            <Button variant="ghost" type="button" onClick={() => { setIsAddOpen(false); setCourseName(''); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting || !courseName.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
