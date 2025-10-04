import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { ratingValueSchema, parse } from '../utils/validators';
const jwt = require('jsonwebtoken');

export const router = Router();

router.get('/stores', async (req, res) => {
  const search = String((req.query.search as string) || '');
  let userId: number | undefined = undefined;
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      userId = payload?.id;
    }
  } catch {
    // ignore invalid token for public listing
  }
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};
  const items = await prisma.store.findMany({ where, orderBy: { name: 'asc' } });
  const enriched = await Promise.all(items.map(async (s: any) => {
    const [avg, userRating] = await Promise.all([
      prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { value: true } }),
      userId ? prisma.rating.findUnique({ where: { user_store_unique: { userId, storeId: s.id } } }) : Promise.resolve(null),
    ]);
    return { ...s, overallRating: avg._avg.value || 0, userRating: userRating?.value ?? null };
  }));
  return res.json({ items: enriched });
});

router.get('/stores/:id', async (req, res) => {
  const id = Number(req.params.id);
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) return res.status(404).json({ error: { message: 'Not found' } });
  const [avg, count] = await Promise.all([
    prisma.rating.aggregate({ where: { storeId: id }, _avg: { value: true } }),
    prisma.rating.count({ where: { storeId: id } }),
  ]);
  return res.json({ store, average: avg._avg.value || 0, count });
});

router.post('/stores/:id/ratings', requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const storeId = Number(req.params.id);
  const valueCheck = parse(ratingValueSchema, Number(req.body?.value));
  if (!valueCheck.ok) return res.status(400).json(valueCheck.error);
  const existing = await prisma.rating.findUnique({ where: { user_store_unique: { userId, storeId } } });
  if (existing) return res.status(409).json({ error: { message: 'Rating exists, use PUT to update' } });
  const rating = await prisma.rating.create({ data: { userId, storeId, value: valueCheck.data } });
  const avg = await prisma.rating.aggregate({ where: { storeId }, _avg: { value: true } });
  return res.status(201).json({ rating, average: avg._avg.value || 0 });
});

router.put('/stores/:id/ratings', requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const storeId = Number(req.params.id);
  const valueCheck = parse(ratingValueSchema, Number(req.body?.value));
  if (!valueCheck.ok) return res.status(400).json(valueCheck.error);
  const updated = await prisma.rating.upsert({
    where: { user_store_unique: { userId, storeId } },
    update: { value: valueCheck.data },
    create: { userId, storeId, value: valueCheck.data },
  });
  const avg = await prisma.rating.aggregate({ where: { storeId }, _avg: { value: true } });
  return res.json({ updated, average: avg._avg.value || 0 });
});

router.get('/users/me/ratings', requireAuth, async (req, res) => {
  const userId = req.user!.id;
  const ratings = await prisma.rating.findMany({ where: { userId }, include: { store: true } });
  return res.json({ items: ratings });
});

