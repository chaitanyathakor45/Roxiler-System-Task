import { Router } from 'express';
import { AdminOnly, requireAuth } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { addressSchema, nameSchema, parse, emailSchema, passwordSchema } from '../utils/validators';
const bcrypt = require('bcryptjs');

export const router = Router();

router.use(requireAuth, AdminOnly);

router.post('/users', async (req, res) => {
  const { name, email, address, role, password } = req.body || {};
  const nameCheck = parse(nameSchema, name);
  const addrCheck = parse(addressSchema, address || '');
  const emailCheck = parse(emailSchema, email);
  const passCheck = password ? parse(passwordSchema, password) : { ok: true as const };
  if (!nameCheck.ok || !addrCheck.ok || !emailCheck.ok || !passCheck.ok) return res.status(400).json({ error: { message: 'Validation failed' } });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: { message: 'Email already exists' } });
  const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash(Math.random().toString(36).slice(2, 10), 10);
  const user = await prisma.user.create({ data: { name, email, address, role: role || 'USER', passwordHash } });
  return res.status(201).json(user);
});

router.get('/users', async (req, res) => {
  const { filter, sort, page = '1', size = '10' } = req.query as any;
  const where: any = {};
  if (filter?.name) where.name = { contains: String(filter.name), mode: 'insensitive' };
  if (filter?.email) where.email = { contains: String(filter.email), mode: 'insensitive' };
  if (filter?.address) where.address = { contains: String(filter.address), mode: 'insensitive' };
  if (filter?.role) where.role = String(filter.role);
  const orderDir = String(sort?.dir) === 'desc' ? 'desc' : 'asc';
  const orderBy = sort?.field ? ({ [String(sort.field)]: orderDir } as any) : ({ createdAt: 'desc' } as any);
  const take = Number(size) || 10;
  const skip = (Number(page) - 1) * take;
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy, take, skip }),
    prisma.user.count({ where }),
  ]);
  // For owners, fetch average rating
  const itemsWithRatings = await Promise.all(items.map(async (u: any) => {
    if (u.role === 'OWNER') {
      const store = await prisma.store.findFirst({ where: { ownerUserId: u.id } });
      if (store) {
        const avg = await prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { value: true } });
        return { ...u, ownerRating: avg._avg.value || 0 };
      }
    }
    return u;
  }));
  return res.json({ items: itemsWithRatings, total, page: Number(page), size: take });
});

router.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: { message: 'Not found' } });
  const result: any = { ...user };
  if (user.role === 'OWNER') {
    const store = await prisma.store.findFirst({ where: { ownerUserId: user.id } });
    if (store) {
      const avg = await prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { value: true } });
      result.ownerRating = avg._avg.value || 0;
    }
  }
  return res.json(result);
});

router.post('/stores', async (req, res) => {
  const { name, email, address, ownerUserId } = req.body || {};
  const nameCheck = parse(nameSchema, name);
  const addrCheck = parse(addressSchema, address || '');
  if (!nameCheck.ok || !addrCheck.ok) return res.status(400).json({ error: { message: 'Validation failed' } });
  const store = await prisma.store.create({ data: { name, email, address, ownerUserId: ownerUserId || null } });
  return res.status(201).json(store);
});

router.get('/stores', async (req, res) => {
  const { filter, sort, page = '1', size = '10' } = req.query as any;
  const where: any = {};
  if (filter?.name) where.name = { contains: String(filter.name), mode: 'insensitive' };
  if (filter?.address) where.address = { contains: String(filter.address), mode: 'insensitive' };
  const orderDir = String(sort?.dir) === 'desc' ? 'desc' : 'asc';
  const orderBy = sort?.field ? ({ [String(sort.field)]: orderDir } as any) : ({ createdAt: 'desc' } as any);
  const take = Number(size) || 10;
  const skip = (Number(page) - 1) * take;
  const [items, total] = await Promise.all([
    prisma.store.findMany({ where, orderBy, take, skip }),
    prisma.store.count({ where }),
  ]);
  const storesWithRating = await Promise.all(items.map(async (s: any) => {
    const avg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { value: true } });
    return { ...s, rating: avg._avg.value || 0 };
  }));
  return res.json({ items: storesWithRating, total, page: Number(page), size: take });
});

router.get('/metrics', async (_req, res) => {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return res.json({ users, stores, ratings });
});

