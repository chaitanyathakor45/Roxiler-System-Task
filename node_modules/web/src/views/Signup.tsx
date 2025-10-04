import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import client from '../api/client';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name too long'),
  address: z.string().min(1, 'Address is required').max(400),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be 8-16 chars')
    .max(16, 'Password must be 8-16 chars')
    .regex(/[A-Z]/, 'Must include uppercase letter')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must include special character'),
});

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = { ...data, email: data.email.trim().toLowerCase() };
      await client.post('/auth/signup', payload);
      toast.success('Account created — please log in');
      navigate('/login');
    } catch (err: any) {
      const issues = err?.response?.data?.error?.issues;
      if (Array.isArray(issues)) {
        issues.forEach((i: any) => {
          const path = i.path || '';
          setError(path as any, { message: i.message });
        });
      } else {
        toast.error(err?.response?.data?.error?.message || 'Signup failed');
      }
    }
  };

  return (
    <main className="container">
      <section className="card form" aria-labelledby="signup-title">
        <h2 id="signup-title" style={{ textAlign: 'center' }}>Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label>Name</label>
            <input {...register('name')} placeholder="Full name (20-60 chars)" />
            {errors.name && <div className="muted" style={{ color: 'var(--danger)' }}>{errors.name.message}</div>}
          </div>

          <div className="field">
            <label>Address</label>
            <input {...register('address')} placeholder="Address" />
            {errors.address && <div className="muted" style={{ color: 'var(--danger)' }}>{errors.address.message}</div>}
          </div>

          <div className="field">
            <label>Email</label>
            <input {...register('email')} placeholder="Email" />
            {errors.email && <div className="muted" style={{ color: 'var(--danger)' }}>{errors.email.message}</div>}
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" {...register('password')} placeholder="Password" />
            {errors.password && <div className="muted" style={{ color: 'var(--danger)' }}>{errors.password.message}</div>}
          </div>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button className="btn" type="submit" disabled={isSubmitting}>Create account</button>
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: 14 }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}

