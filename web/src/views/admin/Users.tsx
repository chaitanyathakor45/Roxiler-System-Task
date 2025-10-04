import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';
import Nav from '../../components/Nav';
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Users() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['admin-users', name, email, role, sort.field, sort.dir],
    queryFn: async () => (
      await client.get('/admin/users', { params: { filter: { name, email, role }, sort, page: 1, size: 20 } })
    ).data,
  });



  // --- Create user form ---
  const createSchema = z.object({
    name: z.string().min(20).max(60),
    email: z.string().email(),
    address: z.string().min(1).max(400),
    password: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/),
    role: z.enum(['ADMIN', 'USER', 'OWNER']),
  });

  type CreateData = z.infer<typeof createSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateData>({ resolver: zodResolver(createSchema) });

  const onCreate = async (data: CreateData) => {
    try {
      const payload = { ...data, email: data.email.trim().toLowerCase(), role: data.role || 'USER' };
      await client.post('/admin/users', payload);
      reset();
      refetch();
      toast.success('User created');
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Create failed');
    }
  };

  return (
    <div>
      <Nav />
      <main className="container fade-in">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">Users</h2>
          <div className="d-flex gap-2 align-items-center">
            <input className="form-control form-control-sm" style={{ width: 180 }} placeholder="Filter name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="form-control form-control-sm" style={{ width: 200 }} placeholder="Filter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="form-select form-select-sm" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: 140 }}>
              <option value="">All roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
            </select>
            <button onClick={() => refetch()} disabled={isFetching} className="btn btn-primary btn-sm">Apply</button>
          </div>
        </div>

        <div className="card b-card mb-3 p-3 hover-elevate">
          <form onSubmit={handleSubmit(onCreate)} className="row g-2 align-items-end">
            <div className="col-auto">
              <label className="form-label">Name</label>
              <input className="form-control" {...register('name')} placeholder="Full name (20-60 chars)" />
              {errors.name && <div className="muted text-danger small">{errors.name.message}</div>}
            </div>
            <div className="col-auto">
              <label className="form-label">Email</label>
              <input className="form-control" {...register('email')} placeholder="Email" />
              {errors.email && <div className="muted text-danger small">{errors.email.message}</div>}
            </div>
            <div className="col-auto">
              <label className="form-label">Role</label>
              <select className="form-select" {...register('role') as any}>
                <option value="USER">USER</option>
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="col-auto">
              <label className="form-label">Password</label>
              <input className="form-control" {...register('password')} placeholder="Password" />
              {errors.password && <div className="muted text-danger small">{errors.password.message}</div>}
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

        <div className="card b-card list-hover">
          <div className="card-body p-0">
            <table className="table mb-0 text-white">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {(data?.items || []).map((u: any) => (
                  <tr key={u.id} className="fade-up">
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

