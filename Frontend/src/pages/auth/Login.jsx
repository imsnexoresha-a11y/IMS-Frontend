import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerStudent } from '../../api/authApi';

// Gamification Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [gitHubUrl, setGitHubUrl] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showGamifiedSuccess, setShowGamifiedSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      try {
        setIsLoading(true);
        await registerStudent({
          name,
          email,
          password,
          dob,
          linkedInUrl,
          gitHubUrl
        });
        // Show Gamified Registration Popup before logging in
        setShowGamifiedSuccess(true);
        setTimeout(async () => {
          setShowGamifiedSuccess(false);
          await proceedWithLogin();
        }, 3500);
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    await proceedWithLogin();
  };

  const proceedWithLogin = async () => {
    const result = await login(email, password);
    if (result) {
      if (from) {
        navigate(from, { replace: true });
      } else {
        const paths = {
          [ROLES.ADMIN]: '/admin',
          [ROLES.TEACHER]: '/teacher',
          [ROLES.STUDENT]: '/student',
        };
        navigate(paths[result.role] || '/');
      }
    } else {
      alert('Login failed');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      padding: 'var(--space-xl)',
      perspective: '1200px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(40px)', zIndex: 0 }} />

      <AnimatePresence>
        {showGamifiedSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              padding: 'var(--space-xl) var(--space-2xl)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--color-primary)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: '4rem', display: 'block', marginBottom: '10px' }}
            >
              🌟
            </motion.span>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Level 1 Unlocked!
            </h2>
            <p style={{ margin: '5px 0 0', fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)' }}>
              Welcome to IMS. Prepare to level up your skills!
            </p>
            <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Logging you in...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ rotateY: isRegister ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          transformStyle: 'preserve-3d',
          position: 'relative',
          height: isRegister ? '680px' : '520px',
          zIndex: 1
        }}
      >
        {/* Front (Login) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-2xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-lg)', textAlign: 'center', background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            IMS Login
          </h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}
              >
                Forgot Password?
              </button>
            </div>

            <Button variant="primary" type="submit" fullWidth style={{ marginTop: 'var(--space-sm)', transform: 'scale(1)', transition: 'transform 0.1s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              Sign In
            </Button>
          </form>
        </div>

        {/* Back (Register) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-2xl)',
          transform: 'rotateY(180deg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-lg)', textAlign: 'center', background: 'linear-gradient(45deg, var(--color-secondary), var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Student Register
          </h1>
          
          <motion.form 
            variants={staggerContainer}
            initial="hidden"
            animate={isRegister ? "show" : "hidden"}
            onSubmit={handleSubmit} 
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
          >
            <motion.div variants={itemVariant}>
              <Input label="Full Name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </motion.div>
            
            <motion.div variants={itemVariant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </motion.div>

            <motion.div variants={itemVariant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <Input label="LinkedIn Link" type="url" placeholder="https://linkedin.com/in/..." value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} />
              <Input label="GitHub Link" type="url" placeholder="https://github.com/..." value={gitHubUrl} onChange={(e) => setGitHubUrl(e.target.value)} />
            </motion.div>

            <motion.div variants={itemVariant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Profile Picture</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="file" 
                    id="profilePic"
                    accept=".jpg, .jpeg, .png" 
                    onChange={handleFileChange}
                    style={{ position: 'absolute', width: '0', height: '0', opacity: 0 }} 
                  />
                  <label 
                    htmlFor="profilePic" 
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      height: '42px', border: '1px dashed var(--color-primary)', 
                      borderRadius: 'var(--radius-md)', cursor: 'pointer', 
                      backgroundColor: 'rgba(0,0,0,0.02)', fontSize: 'var(--text-sm)',
                      color: fileName ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      transition: 'background-color 0.2s',
                      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0 10px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                  >
                    {fileName || "📸 Upload Photo"}
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariant}>
              <Button variant="secondary" type="submit" fullWidth disabled={isLoading} style={{ marginTop: 'var(--space-md)', transform: 'scale(1)', transition: 'transform 0.1s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                {isLoading ? 'Creating...' : 'Create Account'}
              </Button>
            </motion.div>
          </motion.form>

          <div style={{ marginTop: 'var(--space-lg)', fontSize: 'var(--text-sm)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <button onClick={() => setIsRegister(false)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}>
              Login Here
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
