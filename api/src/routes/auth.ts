import { Router } from 'express';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { prisma } from '../utils/prisma';
import { parse, emailSchema, passwordSchema, addressSchema, nameSchema } from '../utils/validators';
import { requireAuth } from '../middleware/auth';

export const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password, name, address } = req.body || {};
  const emailCheck = parse(emailSchema, email);
  const passwordCheck = parse(passwordSchema, password);
  const nameCheck = parse(nameSchema, name || '');
  const addressCheck = parse(addressSchema, address || '');
  if (!emailCheck.ok || !passwordCheck.ok || !nameCheck.ok || !addressCheck.ok) {
    const issues = [] as any[];
    if (!emailCheck.ok) issues.push(...(emailCheck.error.error.issues || []));
    if (!passwordCheck.ok) issues.push(...(passwordCheck.error.error.issues || []));
    if (!nameCheck.ok) issues.push(...(nameCheck.error.error.issues || []));
    if (!addressCheck.ok) issues.push(...(addressCheck.error.error.issues || []));
    return res.status(400).json({ error: { message: 'Validation failed', issues } });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: { message: 'Email already exists' } });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, name, address, role: 'USER', passwordHash } });
  return res.status(201).json({ id: user.id, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const emailCheck = parse(emailSchema, email);
  const passwordCheck = parse(passwordSchema, password);
  if (!emailCheck.ok || !passwordCheck.ok) return res.status(400).json({ error: { message: 'Invalid credentials' } });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
  return res.json({ token });
});

router.post('/logout', async (_req, res) => {
  return res.json({ ok: true });
});

// change password while authenticated (preferred)
router.post('/password', requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  const newPassCheck = parse(passwordSchema, newPassword);
  if (!newPassCheck.ok) return res.status(400).json({ error: { message: 'Invalid new password' } });
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: { message: 'User not found' } });
  const ok = await bcrypt.compare(oldPassword || '', user.passwordHash);
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return res.json({ ok: true });
});

// legacy endpoint that uses email for password reset (kept for compatibility)
router.post('/password/reset', async (req, res) => {
  const { email, oldPassword, newPassword } = req.body || {};
  const emailCheck = parse(emailSchema, email);
  const newPassCheck = parse(passwordSchema, newPassword);
  if (!emailCheck.ok || !newPassCheck.ok) return res.status(400).json({ error: { message: 'Invalid request' } });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: { message: 'User not found' } });
  const ok = await bcrypt.compare(oldPassword || '', user.passwordHash);
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return res.json({ ok: true });
});

