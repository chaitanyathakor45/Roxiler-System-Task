import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';

export default function Dashboard() {
  const { data: store } = useQuery({ queryKey: ['owner-store'], queryFn: async () => (await client.get('/owner/store')).data });
  const { data: avg } = useQuery({ queryKey: ['owner-avg'], queryFn: async () => (await client.get('/owner/store/average-rating')).data });
  const { data: ratings } = useQuery({ queryKey: ['owner-ratings'], queryFn: async () => (await client.get('/owner/store/ratings')).data });
  return (
    <main className="container">
      <h2>Owner Dashboard</h2>
      <section className="card" style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <strong>Store:</strong> {store?.name} — {store?.address}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Average rating:</strong> {avg?.average ?? 0}
        </div>
        <div>
          <h3>Raters</h3>
          <table className="table" cellPadding={6} style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {(ratings?.items || []).map((r: any) => (
                <tr key={r.id}>
                  <td>{r.user?.name || r.user?.email}</td>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

