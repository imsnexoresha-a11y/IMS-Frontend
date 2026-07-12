import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { getQuizzes } from '../../api/studentApi';

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Failed to load quizzes', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const startQuiz = (quiz) => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      setActiveQuiz(quiz);
    }, 1500);
  };

  if (loading) return <LoadingSpinner />;

  if (isStarting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ fontSize: '4rem' }}>
          ⏳
        </motion.div>
        <h2 style={{ marginTop: 'var(--space-lg)', color: 'var(--color-primary)' }}>Preparing your quiz...</h2>
      </div>
    );
  }

  if (activeQuiz) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
            <span style={{ fontSize: '4rem' }}>📋</span>
            <h2 style={{ fontSize: 'var(--text-2xl)', margin: 'var(--space-md) 0' }}>{activeQuiz.title}</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
              This quiz requires taking an external assessment. Please click the link below to begin.
            </p>
            
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <a href={activeQuiz.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Go to Assessment Link 🚀</Button>
              </a>
              <Button variant="secondary" onClick={() => setActiveQuiz(null)} style={{ marginTop: '10px' }}>Back to Dashboard</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
      {quizzes.length === 0 ? (
        <Card>
          <p style={{ color: 'var(--color-text-secondary)' }}>No quizzes assigned at the moment.</p>
        </Card>
      ) : (
        quizzes.map((quiz, i) => (
          <motion.div 
            key={quiz.id || quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="student-block-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: `4px solid var(--color-primary)` }}>
              <div style={{ padding: 'var(--space-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '2.5rem' }}>📋</span>
                </div>
                
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 'var(--space-md) 0' }}>{quiz.title}</h3>
                
                <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
                  <span>🎯 {quiz.totalMarks} Marks</span>
                  <span>✅ Pass: {quiz.passingMarks}</span>
                  <span>⏱️ {quiz.totaldurationInMins} mins</span>
                  <span>⏳ Due: {new Date(quiz.submissionDeadline).toLocaleDateString()}</span>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  {new Date(quiz.submissionDeadline) > new Date() ? (
                    <Button fullWidth onClick={() => startQuiz(quiz)} style={{ background: 'var(--color-primary)', color: 'white' }}>Start Quiz</Button>
                  ) : (
                    <Button fullWidth variant="secondary" disabled>Deadline Passed</Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
}
