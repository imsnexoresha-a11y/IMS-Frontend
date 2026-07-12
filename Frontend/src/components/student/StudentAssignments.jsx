import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';
import { getAssignments, submitAssignment } from '../../api/studentApi';

export default function StudentAssignments({ assignments: assignmentsProp }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (assignmentsProp !== undefined) {
      setAssignments(assignmentsProp || []);
      setLoading(false);
    } else {
      loadAssignments();
    }
  }, [assignmentsProp, toast]);

  const loadAssignments = async () => {
    try {
      const res = await getAssignments();
      setAssignments(res || []);
    } catch (err) {
      toast.error('Error', 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    if (!githubUrl.includes('github.com')) {
      toast.error('Validation', 'Please provide a valid GitHub URL');
      return;
    }
    
    setSubmitting(true);
    try {
      // Extract repo name from URL (e.g. https://github.com/user/repo-name -> repo-name)
      const parts = githubUrl.trim().replace(/\/$/, '').split('/');
      const repoName = parts[parts.length - 1];

      await submitAssignment(assignmentId, { 
        gitSubmissionLink: githubUrl,
        repoName: repoName
      });
      setSelectedAssignment(null);
      setGithubUrl('');
      loadAssignments();
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (err) {
      toast.error('Error', err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', position: 'relative' }}>
      
      {/* Gamification Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--color-success)',
              color: 'white',
              padding: 'var(--space-lg) var(--space-2xl)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🏆</span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Achievement Unlocked!</h2>
            <p style={{ margin: '5px 0 0', fontSize: 'var(--text-md)' }}>Assignment Submitted Successfully +50 XP</p>
          </motion.div>
        )}
      </AnimatePresence>

      {assignments.length === 0 ? (
        <Card title="Assignments">
          <p style={{ color: 'var(--color-text-secondary)' }}>No assignments assigned yet.</p>
        </Card>
      ) : (
        <>
          <div style={{ marginBottom: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-surface)', border: 'var(--border)', boxShadow: 'var(--shadow-sm)', display: 'inline-block', fontWeight: 'bold' }}>
            Today's Date: <span style={{ color: 'var(--color-primary)' }}>{new Date().toLocaleDateString()}</span>
          </div>
          {assignments.map((assignment) => (
          <motion.div 
            key={assignment.id || assignment._id}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card title={assignment.title} className="student-block-hover">
              <p>{assignment.description || assignment.task}</p>
              <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Deadline: {new Date(assignment.submissionDeadline || assignment.deadline || assignment.dueDate).toLocaleDateString()}
                </div>
                
                {assignment.status === 'submitted' || assignment.status === 'reviewed' || assignment.submitted ? (
                  <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <span className="badge-gamified" style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: 'var(--space-xs) var(--space-sm)', borderRadius: 'var(--radius-sm)' }}>
                      {assignment.status === 'reviewed' ? 'Reviewed' : 'Submitted'}
                    </span>
                    {assignment.score !== undefined && assignment.score !== null && (
                      <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>Marks: {assignment.score}</span>
                    )}
                    <Button 
                      variant="secondary" 
                      onClick={() => setSelectedAssignment(selectedAssignment?.id === (assignment.id || assignment._id) ? null : assignment)}
                    >
                      {selectedAssignment?.id === (assignment.id || assignment._id) ? 'Cancel' : 'Review & Resubmit'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => setSelectedAssignment(selectedAssignment?.id === (assignment.id || assignment._id) ? null : assignment)}
                  >
                    {selectedAssignment?.id === (assignment.id || assignment._id) ? 'Cancel' : 'Submit Task'}
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {selectedAssignment?.id === (assignment.id || assignment._id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <form onSubmit={(e) => handleSubmit(e, assignment.id || assignment._id)} style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <div style={{ flex: 1 }}>
                          <Input 
                            placeholder="https://github.com/your-username/repo" 
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" variant="primary" disabled={submitting}>
                          {submitting ? 'Submitting...' : 'Submit 🚀'}
                        </Button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
        </>
      )}
    </div>
  );
}
