import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import Nav from '../../components/Nav';

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ['metrics'], queryFn: async () => (await client.get('/admin/metrics')).data });
  return (
    <div>
      <Nav />
      <div style={{ padding: 24 }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <a className="metric-card" href="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>Users</div>
            <h3>{data?.users ?? '-'}</h3>
          </a>
          <a className="metric-card" href="/admin/stores" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div>Stores</div>
            <h3>{data?.stores ?? '-'}</h3>
          </a>
          <div className="metric-card">
            <div>Ratings</div>
            <h3>{data?.ratings ?? '-'}</h3>
          </div>
        </div>
        
      </div>
    </div>
  );
}

