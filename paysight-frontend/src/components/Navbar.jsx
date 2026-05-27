import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💰 PaySight</div>
      <div style={styles.right}>
        <span style={styles.welcome}>Hi, {user?.name}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', background: '#1e293b',
    borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: '1.4rem', fontWeight: 700, color: '#6366f1' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  welcome: { color: '#94a3b8', fontSize: '0.95rem' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #475569',
    color: '#94a3b8', padding: '0.4rem 1rem',
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
  },
};