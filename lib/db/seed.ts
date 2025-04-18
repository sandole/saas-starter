import { db } from './drizzle';
import { products, users } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function seedProducts() {
  console.log('Seeding products...');

  // Check if products already exist
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length > 0) {
    console.log('Products already exist, skipping seed.');
    return;
  }

  await db.insert(products).values([
    {
      name: 'Elegant Ceramic Pot',
      description: 'A beautiful ceramic pot with elegant designs, perfect for indoor plants.',
      price: 24.99,
      imageUrl: '/images/elegant-pot.jpg',
      stock: 50,
    },
    {
      name: 'Modern Minimalist Pot',
      description: 'A sleek, modern pot with clean lines and a minimalist aesthetic.',
      price: 19.99,
      imageUrl: '/images/modern-pot.jpg',
      stock: 75,
    },
    {
      name: 'Classic Terracotta Pot',
      description: 'A timeless terracotta pot, perfect for herbs and outdoor plants.',
      price: 14.99,
      imageUrl: '/images/classic-pot.jpg',
      stock: 100,
    },
  ]);

  console.log('Products seeded successfully.');
}

async function seedTestUser() {
  console.log('Seeding test user...');

  // Check if test user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, 'test@example.com'))
    .limit(1);
  
  if (existingUser.length > 0) {
    console.log('Test user already exists, skipping seed.');
    return;
  }

  const email = 'test@example.com';
  const password = 'password123';
  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    email,
    passwordHash,
    name: 'Test User',
  });

  console.log('Test user created:');
  console.log('Email:', email);
  console.log('Password:', password);
}

async function seed() {
  await seedTestUser();
  await seedProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });