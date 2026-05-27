import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>💰 PaySight</div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" name="email"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" name="password"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '1rem' },
  card: { background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '420px', border: '1px solid #334155' },
  logo: { textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' },
  title: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' },
  subtitle: { textAlign: 'center', color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' },
  error: { background: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 500 },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '0.85rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' },
  link: { textAlign: 'center', marginTop: '1.25rem', color: '#64748b', fontSize: '0.9rem' },
};