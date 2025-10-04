// Plain JS seed to avoid ESM loader issues
const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const ownerPass = await bcrypt.hash('Owner@123', 10);
  const userPass = await bcrypt.hash('User@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Administrator Account Name____', email: 'admin@example.com', address: 'Admin Address, City, Country', role: Role.ADMIN, passwordHash: adminPass },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@example.com' },
    update: {},
    create: { name: 'Owner One Display Name_____', email: 'owner1@example.com', address: 'Owner1 Address, City', role: Role.OWNER, passwordHash: ownerPass },
  });
  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: { name: 'Owner Two Display Name______', email: 'owner2@example.com', address: 'Owner2 Address, City', role: Role.OWNER, passwordHash: ownerPass },
  });

  const store1 = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Gourmet Coffeehouse Downtown_____', email: 'store1@example.com', address: '123 Main St, City', ownerUserId: owner1.id },
  });
  const store2 = await prisma.store.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Artisan Bakery at Riverside_____', email: 'store2@example.com', address: '456 River Rd, City', ownerUserId: owner2.id },
  });

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const u = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: { name: `Regular User ${i} Fullname______`, email: `user${i}@example.com`, address: `User Address ${i}`, role: Role.USER, passwordHash: userPass },
    });
    users.push(u);
  }

  for (let idx = 0; idx < users.length; idx++) {
    const u = users[idx];
    const r1 = ((idx % 5) + 1);
    const r2 = (((idx + 2) % 5) + 1);
    await prisma.rating.upsert({ where: { userId_storeId: { userId: u.id, storeId: store1.id } }, update: { value: r1 }, create: { userId: u.id, storeId: store1.id, value: r1 } });
    await prisma.rating.upsert({ where: { userId_storeId: { userId: u.id, storeId: store2.id } }, update: { value: r2 }, create: { userId: u.id, storeId: store2.id, value: r2 } });
  }

  console.log('Seed completed:', { admin: admin.email, owners: [owner1.email, owner2.email], users: users.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

