const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({ take: 50 });
    console.log('users:', users.map(u => ({ id: u.id, email: u.email, role: u.role }))); 
  } catch (e) { console.error(e); }
  await prisma.$disconnect();
})();
