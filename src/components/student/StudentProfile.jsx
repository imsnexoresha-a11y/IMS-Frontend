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
        <html>
          <head>
            <title>Profile - ${profile?.name || 'Student'}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 16px; }
              th, td { border-bottom: 1px solid #eee; padding: 12px 8px; text-align: left; }
              td:first-child { font-weight: bold; width: 200px; color: #555; }
              h1 { font-size: 28px; border-bottom: 2px solid #222; padding-bottom: 10px; margin-bottom: 24px; color: #111; }
              img { border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
              .footer { margin-top: 50px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
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
      
      // Allow image to load before triggering print
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

      {/* 
        HIDDEN PDF TEMPLATE 
        This is what html2pdf will capture, generating a clean, formal document 
        instead of a screenshot of the UI.
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
        <h1 style={{ fontSize: '24px', borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '20px' }}>
          Student Profile Record
        </h1>
        
        {profile?.profilePic && (
          <img 
            src={profile.profilePic} 
            alt="Profile" 
            style={{ width: '120px', height: '120px', objectFit: 'cover', border: '1px solid black', marginBottom: '20px' }} 
          />
        )}
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '16px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold', width: '200px' }}>Full Name:</td>
              <td style={{ padding: '8px 0' }}>{displayName}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Email Address:</td>
              <td style={{ padding: '8px 0' }}>{profile?.user?.email || profile?.email || 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Date of Birth:</td>
              <td style={{ padding: '8px 0' }}>{profile?.dateOfBirth || 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>GitHub Link:</td>
              <td style={{ padding: '8px 0' }}>{profile?.githubLink || profile?.gitHubUrl || 'N/A'}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>LinkedIn Link:</td>
              <td style={{ padding: '8px 0' }}>{profile?.linkedinLink || profile?.linkedInUrl || 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '50px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          Generated by IMS on {new Date().toLocaleDateString()}
        </div>
        </div>
      </div>
    </div>
  );
}
