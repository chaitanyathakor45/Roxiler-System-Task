import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { clearAuth } from '../store/slices/authSlice';

export default function Nav() {
  const role = useSelector((s: RootState) => s.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <header className="site-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <nav aria-label="Main navigation">
          <Link to={role === 'ADMIN' ? '/admin' : role === 'OWNER' ? '/owner' : '/catalog'}>Home</Link>
          {role === 'ADMIN' && (
            <>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}
          {role === 'USER' && <Link to="/catalog">Catalog</Link>}
          {role === 'OWNER' && <Link to="/owner">Dashboard</Link>}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/profile">Profile</Link>
          <button className="btn secondary" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}

