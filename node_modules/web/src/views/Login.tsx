import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import client from '../api/client';
import { setAuth } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setFieldErrors({});
      const payload = { email: email.trim().toLowerCase(), password };
      const { data } = await client.post('/auth/login', payload);
      const token = data.token as string;
      // naive decode to get role from payload
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('token', token);
      dispatch(setAuth({ token, role: tokenPayload.role }));
      if (tokenPayload.role === 'ADMIN') navigate('/admin');
      else if (tokenPayload.role === 'OWNER') navigate('/owner');
      else navigate('/catalog');
    } catch (err: any) {
      const errBody = err?.response?.data?.error;
      // server may send a zod issues array
      const issues = errBody?.issues;
      if (Array.isArray(issues)) {
        const map: any = {};
        issues.forEach((it: any) => {
          const p = (it.path && it.path[0]) || 'form';
          map[p] = it.message;
        });
        setFieldErrors(map);
        setError(null);
      } else {
        const msg = errBody?.message || 'Login failed';
        setError(msg);
        toast.error(msg);
      }
    }
  };

  return (
    <main className="container">
      <section className="card form" style={{ maxWidth: 420, margin: '32px auto' }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors({ ...fieldErrors, email: undefined }); }} />
            {fieldErrors.email && <div className="muted" style={{ color: 'var(--danger)' }}>{fieldErrors.email}</div>}
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors({ ...fieldErrors, password: undefined }); }} />
            {fieldErrors.password && <div className="muted" style={{ color: 'var(--danger)' }}>{fieldErrors.password}</div>}
          </div>
          {error && <div className="muted" style={{ color: 'var(--danger)' }}>{error}</div>}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button className="btn" type="submit">Login</button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: 14 }}>
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}

