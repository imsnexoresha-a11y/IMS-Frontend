import { useStudentProfile, useUpdateStudentProfile } from '../../hooks/useStudents';
import StudentProfileForm from './StudentProfileForm';
import { useToast } from '../common/Toast';
import html2pdf from 'html2pdf.js';
import { useState, useRef } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

export default function StudentProfile() {
  const { data: profile, isLoading, isError } = useStudentProfile();
  const updateProfileMutation = useUpdateStudentProfile();
  const toast = useToast();
  const [downloading, setDownloading] = useState(false);
  const pdfTemplateRef = useRef(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-error)' }}>
        <h2>Oops! Something went wrong.</h2>
      </div>
    );
  }

  const handleSave = async (data) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success('Success', 'Profile updated successfully!');
    } catch (e) {
      toast.error('Error', e.message || 'Failed to update profile');
    }
  };

  const handleDownload = async () => {
    if (!pdfTemplateRef.current) return;
    setDownloading(true);
    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Student Profile - ${displayName}</title>
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
              .pdf-container {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                background: #FAF8F5;
              }
              .hero-card {
                background: #FFFFFF;
                border: 1.5px solid #EFEBE4;
                border-top: 4px solid #FF5D00;
                border-radius: 16px;
                padding: 28px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 8px 24px rgba(0,0,0,0.03);
                margin-bottom: 24px;
              }
              .avatar {
                width: 96px;
                height: 96px;
                border-radius: 16px;
                object-fit: cover;
                border: 3px solid #FF5D00;
                box-shadow: 0 4px 14px rgba(255, 93, 0, 0.2);
              }
              .avatar-placeholder {
                width: 96px;
                height: 96px;
                border-radius: 16px;
                background: #FFF4EE;
                border: 3px solid #FF5D00;
                color: #FF5D00;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: 900;
              }
              .badge-pill {
                display: inline-block;
                padding: 5px 14px;
                border-radius: 20px;
                background: rgba(255, 93, 0, 0.08);
                color: #FF5D00;
                border: 1px solid rgba(255, 93, 0, 0.3);
                font-size: 12px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .section-card {
                background: #FFFFFF;
                border: 1.5px solid #EFEBE4;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.02);
                margin-bottom: 24px;
              }
              .section-title {
                font-size: 16px;
                font-weight: 800;
                color: #FF5D00;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-top: 0;
                margin-bottom: 18px;
                padding-bottom: 8px;
                border-bottom: 2px solid #FFF0E6;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              tr:nth-child(even) {
                background-color: #FAF8F5;
              }
              td {
                padding: 14px 16px;
                font-size: 14px;
                border-bottom: 1px solid #F0EBE1;
              }
              td.label {
                font-weight: 700;
                color: #555;
                width: 220px;
              }
              td.value {
                font-weight: 600;
                color: #111;
              }
              .watermark-footer {
                background: #F3EEE6;
                border: 1px solid #E6DFD5;
                border-radius: 14px;
                padding: 16px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                color: #666;
                margin-top: 30px;
              }
              @media print {
                body { padding: 20px; background-color: #FAF8F5; }
                .pdf-container { width: 100%; }
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
      toast.error('Error', 'Failed to download profile');
    } finally {
      setDownloading(false);
    }
  };

  const displayName = profile?.user?.name || profile?.name || 'Student';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)', margin: '0' }}>Account Settings</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', margin: '4px 0 0 0' }}>
            Update your personal details and links.
          </p>
        </div>
        <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generating...' : '📥 Export PDF'}
        </Button>
      </div>
      
      <Card className="student-block-hover">
        <div style={{ padding: 'var(--space-xl)' }}>
          <StudentProfileForm profile={profile} onSave={handleSave} />
        </div>
      </Card>

      {/* HIDDEN ELEGANT LIGHT BEIGE PDF TEMPLATE */}
      <div style={{ overflow: 'hidden', height: 0 }}>
        <div ref={pdfTemplateRef} className="pdf-container">
          {/* Executive Hero Banner */}
          <div className="hero-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {profile?.profilePic ? (
                <img src={profile.profilePic} alt="Profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 6px 0', color: '#111' }}>{displayName}</h1>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                  Student Email: <strong style={{ color: '#2E2E2E' }}>{profile?.user?.email || profile?.email || 'N/A'}</strong>
                </p>
                <div className="badge-pill">✓ Verified Academic Profile</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF5D00', textTransform: 'uppercase', letterSpacing: '1px' }}>IMS Institute</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#333', marginTop: '4px' }}>Official Student Record</div>
            </div>
          </div>

          {/* Profile Details Table Section */}
          <div className="section-card">
            <div className="section-title">Personal & Contact Details</div>
            <table>
              <tbody>
                <tr>
                  <td className="label">Full Name:</td>
                  <td className="value">{displayName}</td>
                </tr>
                <tr>
                  <td className="label">Email Address:</td>
                  <td className="value">{profile?.user?.email || profile?.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label">Date of Birth:</td>
                  <td className="value">{profile?.dateOfBirth || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label">GitHub Portfolio:</td>
                  <td className="value" style={{ color: '#FF5D00' }}>{profile?.githubLink || profile?.gitHubUrl || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="label">LinkedIn Network:</td>
                  <td className="value" style={{ color: '#FF5D00' }}>{profile?.linkedinLink || profile?.linkedInUrl || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Watermark Footer */}
          <div className="watermark-footer">
            <div>
              <strong>AUTHENTICATED STUDENT RECORD</strong> • Generated on {new Date().toLocaleDateString()}
            </div>
            <div style={{ color: '#FF5D00', fontWeight: '700' }}>IMS System Verified Stamp</div>
          </div>
        </div>
      </div>
    </div>
  );
}
