import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import { useState } from 'react';
import Nav from '../../components/Nav';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Stores() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['admin-stores', name, address, sort.field, sort.dir],
    queryFn: async () =>
      (
        await client.get('/admin/stores', {
          params: { filter: { name, address }, sort, page: 1, size: 20 },
        })
      ).data,
  });
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/admin/stores', { name: `New Store ${Date.now()}`, email: `store${Date.now()}@example.com`, address: 'Store address' });
      refetch();
      toast.success('Store created');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Create failed');
    }
  };
  // --- Create store form ---
  const createSchema = z.object({
    name: z.string().min(3).max(200),
    email: z.string().email(),
    address: z.string().min(1).max(400),
  });

  type CreateData = z.infer<typeof createSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateData>({ resolver: zodResolver(createSchema) });

  const onCreate = async (data: CreateData) => {
    try {
      const payload = { ...data, email: data.email.trim().toLowerCase() };
      await client.post('/admin/stores', payload);
      reset();
      refetch();
      toast.success('Store created');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Create failed');
    }
  };
  return (
    <div>
      <Nav />
      <main className="container fade-in">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">Stores</h2>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" style={{ width: 200 }} placeholder="Filter name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="form-control form-control-sm" style={{ width: 220 }} placeholder="Filter address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={() => refetch()} disabled={isFetching} className="btn btn-primary btn-sm">Apply</button>
          </div>
        </div>

        <div className="card b-card mb-3 list-hover">
          <div className="card-body p-0">
            <table className="table mb-0 text-white">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {(data?.items || []).map((s: any) => (
                  <tr key={s.id} className="fade-up">
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.address}</td>
                    <td>{s.rating?.toFixed?.(1) ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card b-card p-3 hover-elevate">
          <form onSubmit={handleSubmit(onCreate)} className="row g-2 align-items-end">
            <div className="col-auto">
              <label className="form-label">Name</label>
              <input className="form-control" {...register('name')} placeholder="Store name" />
              {errors.name && <div className="muted text-danger small">{errors.name.message}</div>}
            </div>
            <div className="col-auto">
              <label className="form-label">Email</label>
              <input className="form-control" {...register('email')} placeholder="contact@store.com" />
              {errors.email && <div className="muted text-danger small">{errors.email.message}</div>}
            </div>
            <div className="col-auto">
              <label className="form-label">Address</label>
              <input className="form-control" {...register('address')} placeholder="Address" />
              {errors.address && <div className="muted text-danger small">{errors.address.message}</div>}
            </div>
            <div className="col-auto">
              <button className="btn btn-success" type="submit" disabled={isSubmitting}>Create</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

