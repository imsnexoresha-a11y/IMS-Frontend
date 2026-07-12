import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';
import { getPortfolio } from '../../api/studentApi';

export default function StudentPortfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();
  const pdfTemplateRef = useRef(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getPortfolio();
        setPortfolioData(data);
      } catch (err) {
        toast.error('Error', 'Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [toast]);

  const handleDownload = async () => {
    if (!pdfTemplateRef.current) return;
    setDownloading(true);
    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Portfolio - ${portfolioData?.profile?.enrollementNo || 'Student'}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #222; margin: 0; padding: 40px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              th { background-color: #f4f4f5; font-weight: bold; padding: 12px; text-align: left; border-bottom: 2px solid #222; }
              td { border-bottom: 1px solid #e4e4e7; padding: 12px; text-align: left; }
              h1 { font-size: 36px; margin: 0 0 10px 0; font-weight: 900; letter-spacing: -1px; color: #111; }
              h2 { font-size: 20px; background-color: #18181b; color: white; padding: 10px 16px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; border-radius: 4px; }
              .header-info { margin: 0 0 5px 0; font-size: 16px; color: #555; }
              .skill-tag { display: inline-block; border: 1px solid #d4d4d8; padding: 6px 14px; border-radius: 20px; background-color: #fafafa; font-size: 14px; margin: 4px; font-weight: 500; }
              img { border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
              @media print {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${pdfTemplateRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        toast.success('Success!', 'Print dialog opened for PDF export.');
      }, 500);

    } catch (err) {
      toast.error('Error', err.message || 'Failed to download portfolio');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const profile = portfolioData?.profile || {};
  const metrics = portfolioData?.metrics || {};
  const assignments = portfolioData?.assignments || [];
  const displayName = profile?.user?.name || profile?.name || 'Student';
  const profilePic = profile?.profilePic || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating PDF...' : '📥 Export as PDF'}
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        
        {/* Header Profile Card */}
        <Card className="student-block-hover" style={{ backgroundColor: 'var(--color-surface)', borderLeft: 'var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                style={{ 
                  width: '80px', height: '80px', 
                  border: 'var(--border)',
                  backgroundColor: 'var(--color-bg)',
                  backgroundImage: profilePic ? `url(${profilePic})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(255, 111, 32, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
              }}>
                {!profilePic && (
                  <span style={{ fontSize: '2rem', fontWeight: 'var(--font-black)', color: 'var(--color-ink)' }}>
                    {displayName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </motion.div>
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', margin: 0 }}>{displayName}</h2>
                <p style={{ color: 'var(--color-text-secondary)', margin: '4px 0', fontSize: 'var(--text-md)' }}>
                  Enrollment No: <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-ink)' }}>{profile?.enrollementNo || 'N/A'}</span>
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                  {profile.githubLink && <a href={profile.githubLink} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textDecoration: 'none' }}>GitHub ↗</a>}
                  {profile.linkedinLink && <a href={profile.linkedinLink} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textDecoration: 'none' }}>LinkedIn ↗</a>}
                </div>
              </div>
            </div>
            
            <div style={{ 
              textAlign: 'center', padding: 'var(--space-sm) var(--space-lg)', 
              border: 'var(--border)', backgroundColor: 'var(--color-warning-bg)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '1.5rem' }}>🏆</div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-ink)', textTransform: 'uppercase' }}>Top Performer</div>
            </div>
          </div>
        </Card>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)' }}>
          <MetricCard label="Total Points" value={`${metrics.totalPoints || 0} XP`} icon="✨" />
          <MetricCard label="Batch Rank" value={`#${metrics.rank || '--'}`} icon="🏅" />
          <MetricCard label="Assignment Avg" value={`${metrics.assignmentAvgScore || 0}%`} icon="📝" />
          <MetricCard label="Attendance" value={`${metrics.attendancePercentage || 0}%`} icon="📅" />
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <Card title="Skills Matrix" className="student-block-hover">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
              {profile.skills.map((skill, i) => (
                <span key={i} style={{ 
                  padding: 'var(--space-xs) var(--space-md)', 
                  backgroundColor: 'var(--color-bg)', 
                  border: 'var(--border)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-bold)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Assignment Timeline */}
        <Card title={`Recent Submissions (${assignments.length})`} className="student-block-hover">
          {assignments.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
              No assignment submissions yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
              {assignments.map((item, idx) => (
                <div 
                  key={item.submissionId || idx} 
                  style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    border: 'var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--color-surface)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem' }}>{item.onTimeSubmission ? '✅' : '⏳'}</div>
                    <div>
                      <p style={{ fontWeight: 'var(--font-bold)', margin: 0, fontSize: 'var(--text-md)', color: 'var(--color-ink)' }}>{item.assignment?.title || 'Assignment'}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                        Submitted on {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-bold)',
                    textTransform: 'uppercase',
                    backgroundColor: item.reviewStatus === 'completed' ? 'var(--color-success)' : 'var(--color-warning)',
                    color: 'white',
                    border: 'var(--border)'
                  }}>
                    {item.reviewStatus === 'completed' ? 'Reviewed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Academic Summary (Lectures & Quizzes) */}
        <Card title="Academic Summary" className="student-block-hover">
          <div style={{ padding: 'var(--space-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: 'var(--space-sm)' }}>Module / Topic</th>
                  <th style={{ padding: 'var(--space-sm)' }}>Type</th>
                  <th style={{ padding: 'var(--space-sm)' }}>Completion / Score</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-neutral)' }}>
                  <td style={{ padding: 'var(--space-sm)', fontWeight: 'bold' }}>React Fundamentals</td>
                  <td style={{ padding: 'var(--space-sm)' }}>Quiz</td>
                  <td style={{ padding: 'var(--space-sm)', color: 'var(--color-success)', fontWeight: 'bold' }}>90% Score</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-neutral)' }}>
                  <td style={{ padding: 'var(--space-sm)', fontWeight: 'bold' }}>Advanced State Management</td>
                  <td style={{ padding: 'var(--space-sm)' }}>Quiz</td>
                  <td style={{ padding: 'var(--space-sm)', color: 'var(--color-success)', fontWeight: 'bold' }}>85% Score</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-neutral)' }}>
                  <td style={{ padding: 'var(--space-sm)', fontWeight: 'bold' }}>Modern CSS & Styling</td>
                  <td style={{ padding: 'var(--space-sm)' }}>Lecture Series</td>
                  <td style={{ padding: 'var(--space-sm)' }}>100% Attended</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-neutral)' }}>
                  <td style={{ padding: 'var(--space-sm)', fontWeight: 'bold' }}>Backend API Integration</td>
                  <td style={{ padding: 'var(--space-sm)' }}>Lecture Series</td>
                  <td style={{ padding: 'var(--space-sm)' }}>80% Attended</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 
        HIDDEN PDF TEMPLATE 
        This acts as the genuine, formal resume-style PDF export template.
      */}
      <div 
        style={{ overflow: 'hidden', height: 0 }}
      >
        <div 
          ref={pdfTemplateRef} 
          style={{ 
            padding: '40px', 
            fontFamily: 'Helvetica, Arial, sans-serif', 
            color: 'black', 
            background: 'white',
            width: '800px'
          }}
        >
        {/* PDF Header */}
        <div style={{ borderBottom: '2px solid #e4e4e7', paddingBottom: '30px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>{displayName}</h1>
            <p className="header-info"><strong>Enrollment No:</strong> {profile?.enrollementNo || 'N/A'}</p>
            <p className="header-info" style={{ color: '#888', fontSize: '14px' }}>Generated on: {new Date().toLocaleDateString()}</p>
          </div>
          {profilePic && (
            <img src={profilePic} alt="Profile" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
          )}
        </div>

        {/* Overview Section */}
        <h2>Overview & Metrics</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <tbody>
            <tr>
              <td style={{ backgroundColor: '#fafafa', fontWeight: '600' }}>Total Points</td>
              <td>{metrics.totalPoints || 0} XP</td>
              <td style={{ backgroundColor: '#fafafa', fontWeight: '600' }}>Batch Rank</td>
              <td>#{metrics.rank || '--'}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: '#fafafa', fontWeight: '600' }}>Assignment Avg</td>
              <td>{metrics.assignmentAvgScore || 0}%</td>
              <td style={{ backgroundColor: '#fafafa', fontWeight: '600' }}>Attendance</td>
              <td>{metrics.attendancePercentage || 0}%</td>
            </tr>
          </tbody>
        </table>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <>
            <h2>Technical Skills</h2>
            <div style={{ marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </>
        )}

        {/* Assignments Section */}
        <h2>Recent Assignments</h2>
        <table>
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th>On Time</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '12px' }}>{item.assignment?.title || 'Unknown'}</td>
                <td style={{ padding: '12px' }}>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: '12px' }}>{item.reviewStatus === 'completed' ? 'Reviewed' : 'Pending'}</td>
                <td style={{ padding: '12px' }}>{item.onTimeSubmission ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Lectures & Quizzes Summary Section */}
        <h2>Academic Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Module / Topic</th>
              <th>Type</th>
              <th>Completion / Score</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px' }}>React Fundamentals</td>
              <td style={{ padding: '12px' }}>Quiz</td>
              <td style={{ padding: '12px' }}>90% Score</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px' }}>Advanced State Management</td>
              <td style={{ padding: '12px' }}>Quiz</td>
              <td style={{ padding: '12px' }}>85% Score</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px' }}>Modern CSS & Styling</td>
              <td style={{ padding: '12px' }}>Lecture Series</td>
              <td style={{ padding: '12px' }}>100% Attended</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px' }}>Backend API Integration</td>
              <td style={{ padding: '12px' }}>Lecture Series</td>
              <td style={{ padding: '12px' }}>80% Attended</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className="student-block-hover" style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        <div>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>{label}</p>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--color-ink)', margin: 0 }}>{value}</p>
        </div>
      </Card>
    </motion.div>
  );
}
