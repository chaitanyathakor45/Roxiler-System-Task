import { Router } from 'express';
import { OwnerOnly, requireAuth } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const router = Router();

router.use(requireAuth, OwnerOnly);

router.get('/store', async (req, res) => {
  const store = await prisma.store.findFirst({ where: { ownerUserId: req.user!.id } });
  if (!store) return res.status(404).json({ error: { message: 'Store not found' } });
  return res.json(store);
});

router.get('/store/ratings', async (req, res) => {
  const store = await prisma.store.findFirst({ where: { ownerUserId: req.user!.id } });
  if (!store) return res.status(404).json({ error: { message: 'Store not found' } });
  const ratings = await prisma.rating.findMany({ where: { storeId: store.id }, include: { user: true } });
  return res.json({ items: ratings });
});

router.get('/store/average-rating', async (req, res) => {
  const store = await prisma.store.findFirst({ where: { ownerUserId: req.user!.id } });
  if (!store) return res.status(404).json({ error: { message: 'Store not found' } });
  const avg = await prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { value: true } });
  return res.json({ average: avg._avg.value || 0 });
});

