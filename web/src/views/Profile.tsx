import { useState } from 'react';
import client from '../api/client';
import Nav from '../components/Nav';
import toast from 'react-hot-toast';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/auth/password', { email, oldPassword, newPassword });
      toast.success('Password updated');
      setEmail(''); setOldPassword(''); setNewPassword('');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Update failed');
    }
  };

  return (
    <div>
      <Nav />
      <div style={{ padding: 24, display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <div className="card" style={{ maxWidth: 520 }}>
          <h2>Change Password</h2>
          <p style={{ color: '#9aa4b2' }}>Use a strong password: 8–16 chars, 1 uppercase and 1 special.</p>
          <form onSubmit={submit}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label>Old password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Current password" />
            <label>New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
            <div style={{ marginTop: 12 }}>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
        <div className="card">
          <h2>Your Tips</h2>
          <ul>
            <li>Ratings are 1–5; you can update anytime from the catalog.</li>
            <li>Admins manage users and stores; Owners see average rating and raters.</li>
            <li>Keep your email updated so admins can contact you if needed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

