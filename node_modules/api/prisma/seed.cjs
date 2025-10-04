// CommonJS seed to work with package.json type: module
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

  // Additional demo stores for richer catalog
  const extraStores = [];
  for (let i = 3; i <= 12; i++) {
    const s = await prisma.store.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Neighborhood Market ${i} _____________`,
        email: `store${i}@example.com`,
        address: `${100 + i} Elm Street, City`,
        ownerUserId: i % 2 === 0 ? owner1.id : owner2.id,
      },
    });
    extraStores.push(s);
  }

  const users = [];
  for (let i = 1; i <= 10; i++) {
    const u = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: { name: `Regular User ${i} Fullname______`, email: `user${i}@example.com`, address: `User Address ${i}`, role: Role.USER, passwordHash: userPass },
    });
    users.push(u);
  }

  const allStores = [store1, store2, ...extraStores];
  for (let idx = 0; idx < users.length; idx++) {
    const u = users[idx];
    for (const s of allStores) {
      const value = ((u.id + s.id) % 5) + 1; // deterministic variety
      await prisma.rating.upsert({ where: { user_store_unique: { userId: u.id, storeId: s.id } }, update: { value }, create: { userId: u.id, storeId: s.id, value } });
    }
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

