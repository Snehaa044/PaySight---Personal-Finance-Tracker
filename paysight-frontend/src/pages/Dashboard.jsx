import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1','#f59e0b','#10b981','#f43f5e','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f97316'];
const CATEGORIES = ['FOOD','TRANSPORT','ENTERTAINMENT','SHOPPING','BILLS','HEALTH','EDUCATION','SALARY','OTHER'];
const TYPES = ['INCOME','EXPENSE'];
const emptyForm = {
  description: '', amount: '', type: 'EXPENSE',
  category: 'FOOD', date: new Date().toISOString().split('T')[0],
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [d, t] = await Promise.all([
        api.get('/transactions/dashboard'),
        api.get('/transactions'),
      ]);
      setDashboard(d.data);
      setTransactions(t.data);
    } catch (err) {
      console.error('Fetch failed', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editId) await api.put(`/transactions/${editId}`, payload);
      else await api.post('/transactions', payload);
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t) => {
    setForm({ description: t.description, amount: t.amount, type: t.type, category: t.category, date: t.date });
    setEditId(t.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    fetchData();
  };

  const handleCancel = () => { setShowForm(false); setEditId(null); setForm(emptyForm); setError(''); };

  const pieData = dashboard
    ? Object.entries(dashboard.expenseByCategory).map(([k, v]) => ({ name: k, value: parseFloat(v) }))
    : [];

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>

        {/* Summary Cards */}
        {dashboard && (
          <div style={s.cards}>
            <div style={{ ...s.card, borderTop: '3px solid #10b981' }}>
              <p style={s.cardLabel}>Total Income</p>
              <p style={{ ...s.cardValue, color: '#10b981' }}>₹{parseFloat(dashboard.totalIncome).toLocaleString()}</p>
            </div>
            <div style={{ ...s.card, borderTop: '3px solid #f43f5e' }}>
              <p style={s.cardLabel}>Total Expense</p>
              <p style={{ ...s.cardValue, color: '#f43f5e' }}>₹{parseFloat(dashboard.totalExpense).toLocaleString()}</p>
            </div>
            <div style={{ ...s.card, borderTop: '3px solid #6366f1' }}>
              <p style={s.cardLabel}>Balance</p>
              <p style={{ ...s.cardValue, color: '#6366f1' }}>₹{parseFloat(dashboard.balance).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Charts */}
        {dashboard && (
          <div style={s.charts}>
            <div style={s.chartBox}>
              <h3 style={s.chartTitle}>Monthly Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dashboard.monthlyData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[4,4,0,0]} name="Income" />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[4,4,0,0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={s.chartBox}>
              <h3 style={s.chartTitle}>Expense by Category</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', paddingTop: '4rem' }}>No expense data yet</p>
              )}
            </div>
          </div>
        )}

        {/* Header + Add Button */}
        <div style={s.tableHeader}>
          <h3 style={{ color: '#f1f5f9', margin: 0 }}>Transactions</h3>
          <button onClick={() => setShowForm(!showForm)} style={s.addBtn}>
            {showForm ? '✕ Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={s.formBox}>
            <h3 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>{editId ? '✏️ Edit' : '➕ New'} Transaction</h3>
            {error && <div style={s.formError}>{error}</div>}
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formField}>
                <label style={s.label}>Description</label>
                <input style={s.input} name="description" placeholder="e.g. Groceries" value={form.description} onChange={handleChange} required />
              </div>
              <div style={s.formField}>
                <label style={s.label}>Amount (₹)</label>
                <input style={s.input} name="amount" type="number" placeholder="0.00" value={form.amount} onChange={handleChange} required min="0.01" step="0.01" />
              </div>
              <div style={s.formField}>
                <label style={s.label}>Type</label>
                <select style={s.input} name="type" value={form.type} onChange={handleChange}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={s.formField}>
                <label style={s.label}>Category</label>
                <select style={s.input} name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={s.formField}>
                <label style={s.label}>Date</label>
                <input style={s.input} name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div style={s.formField}>
                <label style={s.label}>&nbsp;</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={s.addBtn} type="submit" disabled={loading}>{loading ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
                  <button style={s.cancelBtn} type="button" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={s.tableBox}>
          <table style={s.table}>
            <thead>
              <tr>{['Date','Description','Category','Type','Amount','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#64748b', padding: '2rem' }}>No transactions yet. Click "+ Add Transaction" to start.</td></tr>
              ) : transactions.map(t => (
                <tr key={t.id} style={s.tr}>
                  <td style={s.td}>{t.date}</td>
                  <td style={s.td}>{t.description}</td>
                  <td style={s.td}><span style={s.badge}>{t.category}</span></td>
                  <td style={s.td}><span style={{ color: t.type === 'INCOME' ? '#10b981' : '#f43f5e', fontWeight: 600 }}>{t.type}</span></td>
                  <td style={{ ...s.td, fontWeight: 700, color: t.type === 'INCOME' ? '#10b981' : '#f43f5e' }}>{t.type === 'INCOME' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}</td>
                  <td style={s.td}>
                    <button onClick={() => handleEdit(t)} style={s.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(t.id)} style={s.delBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0f172a' },
  content: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' },
  cardLabel: { color: '#94a3b8', margin: '0 0 0.5rem', fontSize: '0.9rem' },
  cardValue: { fontSize: '1.8rem', fontWeight: 700, margin: 0 },
  charts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' },
  chartBox: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' },
  chartTitle: { color: '#f1f5f9', margin: '0 0 1rem', fontSize: '1rem' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  addBtn: { background: '#6366f1', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  cancelBtn: { background: '#334155', color: '#f1f5f9', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  formBox: { background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' },
  form: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', alignItems: 'end' },
  formField: { display: 'flex', flexDirection: 'column' },
  formError: { background: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  label: { color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', fontWeight: 500 },
  input: { padding: '0.65rem', borderRadius: '7px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' },
  tableBox: { background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '1rem', color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155', fontSize: '0.85rem', fontWeight: 600, background: '#0f172a' },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '0.9rem 1rem', color: '#f1f5f9', fontSize: '0.9rem' },
  badge: { background: '#1e3a5f', color: '#93c5fd', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 },
  editBtn: { background: '#334155', color: '#f1f5f9', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer', marginRight: '0.4rem', fontSize: '0.8rem' },
  delBtn: { background: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' },
};