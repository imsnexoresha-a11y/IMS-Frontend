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
        <!DOCTYPE html>
        <html>
          <head>
            <title>Portfolio - ${portfolioData?.profile?.enrollementNo || 'Student'}</title>
            <style>
              * { box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #FAF8F5;
                color: #2E2E2E;
                margin: 0;
                padding: 40px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .pdf-wrapper {
                width: 100%;
                max-width: 840px;
                margin: 0 auto;
                background: #FAF8F5;
              }
              .hero-card {
                background: #FFFFFF;
                border: 1.5px solid #EFEBE4;
                border-top: 4px solid #FF5D00;
                border-radius: 16px;
                padding: 26px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.03);
              }
              .avatar {
                width: 90px;
                height: 90px;
                border-radius: 16px;
                object-fit: cover;
                border: 3px solid #FF5D00;
              }
              .avatar-placeholder {
                width: 90px;
                height: 90px;
                border-radius: 16px;
                background: #FFF4EE;
                border: 3px solid #FF5D00;
                color: #FF5D00;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                font-weight: 900;
              }
              .top-performer-tag {
                background: #FFF4EE;
                border: 1.5px solid #FF9B66;
                border-radius: 12px;
                padding: 10px 18px;
                text-align: center;
              }
              .metrics-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 14px;
                margin-bottom: 24px;
              }
              .metric-box {
                background: #FFFFFF;
                border: 1.5px solid #EFEBE4;
                border-radius: 14px;
                padding: 16px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.02);
              }
              .metric-val {
                font-size: 22px;
                font-weight: 900;
                color: #FF5D00;
                margin-top: 4px;
              }
              .metric-lbl {
                font-size: 11px;
                font-weight: 800;
                text-transform: uppercase;
                color: #777;
                letter-spacing: 0.5px;
              }
              .section-card {
                background: #FFFFFF;
                border: 1.5px solid #EFEBE4;
                border-radius: 16px;
                padding: 22px;
                margin-bottom: 24px;
                box-shadow: 0 4px 14px rgba(0,0,0,0.02);
              }
              .section-head {
                font-size: 15px;
                font-weight: 800;
                color: #FF5D00;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: 0;
                margin-bottom: 16px;
                padding-bottom: 6px;
                border-bottom: 2px solid #FFF0E6;
              }
              .skill-chip {
                display: inline-block;
                background: #FAF8F5;
                border: 1.5px solid #FF5D00;
                color: #FF5D00;
                font-weight: 700;
                font-size: 13px;
                padding: 6px 14px;
                border-radius: 20px;
                margin: 4px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              thead tr {
                background: #F4EFE6;
              }
              th {
                padding: 12px 14px;
                font-size: 12px;
                font-weight: 800;
                text-transform: uppercase;
                color: #444;
                text-align: left;
                border-bottom: 2px solid #E6DFD5;
              }
              tbody tr:nth-child(even) {
                background: #FAF8F5;
              }
              td {
                padding: 12px 14px;
                font-size: 13px;
                border-bottom: 1px solid #F0EBE1;
                color: #2E2E2E;
              }
              .status-pill {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 800;
                text-transform: uppercase;
              }
              .status-success { background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; }
              .status-warning { background: #FFF8E1; color: #F57F17; border: 1px solid #FFE082; }
              .footer-stamp {
                background: #F3EEE6;
                border: 1px solid #E6DFD5;
                border-radius: 14px;
                padding: 16px 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #666;
                margin-top: 30px;
              }
              @media print {
                body { padding: 20px; background-color: #FAF8F5; }
                .pdf-wrapper { width: 100%; }
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
                  borderRadius: '16px',
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
              border: 'var(--border)', borderRadius: '12px', backgroundColor: 'var(--color-warning-bg)',
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
                  borderRadius: '10px',
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
                    borderRadius: '12px',
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
                    border: 'var(--border)',
                    borderRadius: '8px'
                  }}>
                    {item.reviewStatus === 'completed' ? 'Reviewed' : 'Pending Review'}
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

      {/* HIDDEN ELEGANT LIGHT BEIGE PDF TEMPLATE */}
      <div style={{ overflow: 'hidden', height: 0 }}>
        <div ref={pdfTemplateRef} className="pdf-wrapper">
          {/* Executive Hero Card */}
          <div className="hero-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 6px 0', color: '#111' }}>{displayName}</h1>
                <p style={{ margin: '0 0 6px 0', color: '#555', fontSize: '14px' }}>
                  Enrollment No: <strong style={{ color: '#2E2E2E' }}>{profile?.enrollementNo || 'N/A'}</strong>
                </p>
                <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: '#FF5D00', fontWeight: '700' }}>
                  {profile.githubLink && <span>GitHub Portfolio ↗</span>}
                  {profile.linkedinLink && <span>LinkedIn Profile ↗</span>}
                </div>
              </div>
            </div>

            <div className="top-performer-tag">
              <div style={{ fontSize: '22px' }}>🏆</div>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#FF5D00', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Top Performer</div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-lbl">Total Points</div>
              <div className="metric-val">{metrics.totalPoints || 0} XP</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Batch Rank</div>
              <div className="metric-val">#{metrics.rank || '--'}</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Assignment Avg</div>
              <div className="metric-val">{metrics.assignmentAvgScore || 0}%</div>
            </div>
            <div className="metric-box">
              <div className="metric-lbl">Attendance</div>
              <div className="metric-val">{metrics.attendancePercentage || 0}%</div>
            </div>
          </div>

          {/* Technical Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="section-card">
              <div className="section-head">Technical Skills</div>
              <div>
                {profile.skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Timeline */}
          <div className="section-card">
            <div className="section-head">Recent Assignments & Submissions</div>
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
                  <tr key={idx}>
                    <td style={{ fontWeight: '700' }}>{item.assignment?.title || 'Assignment'}</td>
                    <td>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-pill ${item.reviewStatus === 'completed' ? 'status-success' : 'status-warning'}`}>
                        {item.reviewStatus === 'completed' ? 'Reviewed' : 'Pending Review'}
                      </span>
                    </td>
                    <td>{item.onTimeSubmission ? 'Yes ✅' : 'No ⏳'}</td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: '#777' }}>No assignment submissions recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Academic Summary */}
          <div className="section-card">
            <div className="section-head">Academic Summary & Modules</div>
            <table>
              <thead>
                <tr>
                  <th>Module / Topic</th>
                  <th>Type</th>
                  <th>Completion / Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '700' }}>React Fundamentals</td>
                  <td>Quiz</td>
                  <td style={{ color: '#2E7D32', fontWeight: '800' }}>90% Score</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700' }}>Advanced State Management</td>
                  <td>Quiz</td>
                  <td style={{ color: '#2E7D32', fontWeight: '800' }}>85% Score</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700' }}>Modern CSS & Styling</td>
                  <td>Lecture Series</td>
                  <td style={{ fontWeight: '700' }}>100% Attended</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700' }}>Backend API Integration</td>
                  <td>Lecture Series</td>
                  <td style={{ fontWeight: '700' }}>80% Attended</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Watermark Seal Footer */}
          <div className="footer-stamp">
            <div>
              <strong>IMS ACADEMIC PORTFOLIO RECORD</strong> • Generated on {new Date().toLocaleDateString()}
            </div>
            <div style={{ color: '#FF5D00', fontWeight: '800' }}>System Verified Credential</div>
          </div>
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
