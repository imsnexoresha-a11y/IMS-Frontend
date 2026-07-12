import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast';
import * as authApi from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export default function Register() {
  console.log('Register page rendered');
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    dob: '',
    password: '',
    confirmPassword: '',
    gitHubUrl: '',
    linkedInUrl: '',
    profilePic: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Error', 'File size must be less than 2MB');
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => handleChange('profilePic', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Register form submitted', formData);

    // Client-side validation
    if (!formData.name.trim()) { toast.error('Error', 'Name is required'); return; }
    if (!formData.email.trim()) { toast.error('Error', 'Email is required'); return; }
    if (!formData.mobileNo.trim() || formData.mobileNo.trim().length < 10) { toast.error('Error', 'Valid mobile number is required (10+ digits)'); return; }
    if (!formData.dob) { toast.error('Error', 'Date of birth is required'); return; }
    if (!formData.password) { toast.error('Error', 'Password is required'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Error', 'Passwords do not match'); return; }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobileNo: formData.mobileNo.trim(),
        dob: formData.dob,
        password: formData.password,
        profileStatus: 'Active',
      };

      if (formData.gitHubUrl.trim()) payload.gitHubUrl = formData.gitHubUrl.trim();
      if (formData.linkedInUrl.trim()) payload.linkedInUrl = formData.linkedInUrl.trim();
      if (formData.profilePic && formData.profilePic.length < 500000) {
        payload.profilePic = formData.profilePic;
      }

      await authApi.registerStudent(payload);

      toast.success('Success', 'Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error('Registration Failed', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      padding: 'var(--space-xl)'
    }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Card title="Student Registration" className="card-3d-tilt" style={{ padding: 'var(--space-2xl)' }}>
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Join the Interactive Management System
          </p>

          <form onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
              <Input label="Full Name" name="name" type="text" placeholder="Jane Doe"
                     value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />

              <Input label="Email Address" name="email" type="email" placeholder="jane@example.com"
                     value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />

              <Input label="Mobile Number" name="mobile" type="tel" placeholder="1234567890"
                     value={formData.mobileNo} onChange={(e) => handleChange('mobileNo', e.target.value)} />

              <Input label="Date of Birth" name="dob" type="date"
                     value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
            </div>

            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: 'var(--border)' }}>
              <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Social & Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-xs)', color: 'var(--color-ink)' }}>
                    Profile Picture (JPG, PNG)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      padding: 'var(--space-sm) var(--space-md)',
                      border: 'var(--border)',
                      backgroundColor: 'var(--color-surface)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                </div>

                <Input label="GitHub URL" name="github" type="url" placeholder="https://github.com/..."
                       value={formData.gitHubUrl} onChange={(e) => handleChange('gitHubUrl', e.target.value)} />

                <Input label="LinkedIn URL" name="linkedin" type="url" placeholder="https://linkedin.com/in/..."
                       value={formData.linkedInUrl} onChange={(e) => handleChange('linkedInUrl', e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: 'var(--border)' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
                <Input label="Password" name="password" type="password"
                       value={formData.password} onChange={(e) => handleChange('password', e.target.value)} />

                <Input label="Confirm Password" name="confirmPassword" type="password"
                       value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
               </div>
            </div>

            <Button type="submit" variant="primary" disabled={loading} style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md) 0' }}>
              {loading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>

          <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-bold)' }}>
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
