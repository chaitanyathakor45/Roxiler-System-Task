import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import client from '../../api/client';
import Nav from '../../components/Nav';
import StarRating from '../../components/StarRating';

export default function Catalog() {
  const [search, setSearch] = useState('');
  const { data } = useQuery({ queryKey: ['stores', search], queryFn: async () => (await client.get('/stores', { params: { search } })).data });
  const qc = useQueryClient();
  const rate = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: number }) => client.put(`/stores/${id}/ratings`, { value }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['stores', search] }),
  });
  return (
    <div>
      <Nav />
      <main className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2>Stores</h2>
          <input placeholder="Search name/address" value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 320 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
          {(data?.items || []).map((s: any) => (
            <article key={s.id} className="card">
              <h3>{s.name}</h3>
              <p className="muted">{s.address}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Overall: <strong>{s.overallRating?.toFixed?.(1) ?? 0}</strong></div>
                <StarRating value={s.userRating || 0} onChange={(n) => rate.mutate({ id: s.id, value: n })} />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

