import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Brand from '../components/Brand.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const signup = mode === 'signup';
  const nav = useNavigate();
  const { login, register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const submit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   const cleanEmail = email.trim().toLowerCase();

  //   if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
  //     setError('Enter a valid email address.');
  //     return;
  //   }
  //   if (password.length < 6) {
  //     setError('Password must be at least 6 characters.');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     if (signup) {
  //       if (!fullName.trim() || !username.trim()) {
  //         setError('Full name and username are required.');
  //         setLoading(false);
  //         return;
  //       }
  //       await register({
  //         fullName: fullName.trim(),
  //         username: username.trim().toLowerCase(),
  //         email: cleanEmail,
  //         password,
  //       });
  //     } else {
  //       await login(cleanEmail, password);
  //     }
  //     nav('/dashboard');
  //   } catch (err) {
  //     setError(err.message || 'Something went wrong. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const submit = async (e) => {
  e.preventDefault();
  setError('');

  const cleanIdentifier = email.trim().toLowerCase();

  if (signup && !/^\S+@\S+\.\S+$/.test(cleanIdentifier)) {
    setError('Enter a valid email address.');
    return;
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters.');
    return;
  }

  setLoading(true);
  try {
    if (signup) {
      if (!fullName.trim() || !username.trim()) {
        setError('Full name and username are required.');
        setLoading(false);
        return;
      }
      await register({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: cleanIdentifier,
        password,
      });
    } else {
      await login(cleanIdentifier, password);
    }
    nav('/dashboard');
  } catch (err) {
    setError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-copy">
          <Brand />
          <span className="eyebrow">LANBETHCARE PORTAL</span>
          <h1>{signup ? 'Start your care portal journey.' : 'Welcome back to better care management.'}</h1>
          <p>Securely manage care operations with a clear, connected workflow.</p>
        </div>
      </div>

      <div className="auth-panel">
        <button className="back-home" onClick={() => nav('/')}>← Back to home</button>
        <div className="auth-form">
          <Brand />
          <span className="eyebrow">{signup ? 'NEW ACCOUNT' : 'ADMIN ACCESS'}</span>
        

          <form onSubmit={submit}>
          
            <label>
              Email or Username
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" required />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="primary big full" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : signup ? 'Create Account' : 'Sign In'} <ChevronRight size={17} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}