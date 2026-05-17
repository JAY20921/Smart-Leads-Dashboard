import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User';
import Lead from '../models/Lead';
import { LEAD_STATUSES, LEAD_SOURCES } from '../constants';

const MONGO_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/smart_leads';

const randomItem = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);
  console.log('Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.dev',
    password: 'Admin@1234',
    role: 'Admin',
  });
  console.log('Admin created:', admin.email);

  // Create sales user
  const salesUser = await User.create({
    name: 'Sales User',
    email: 'sales@smartleads.dev',
    password: 'Sales@1234',
    role: 'SalesUser',
  });
  console.log('Sales user created:', salesUser.email);

  // Generate 50 demo leads
  const names = [
    'Alice Johnson', 'Bob Martinez', 'Clara Lee', 'David Smith', 'Emma Davis',
    'Frank Wilson', 'Grace Taylor', 'Henry Brown', 'Isla White', 'Jack Harris',
    'Kara Thompson', 'Liam Garcia', 'Mia Anderson', 'Noah Jackson', 'Olivia Lewis',
    'Paul Walker', 'Quinn Hall', 'Rachel Allen', 'Sam Young', 'Tina King',
    'Uma Scott', 'Victor Green', 'Wendy Baker', 'Xavier Adams', 'Yara Nelson',
    'Zachary Carter', 'Amy Mitchell', 'Brian Perez', 'Chloe Roberts', 'Daniel Turner',
    'Ella Phillips', 'Felix Campbell', 'Gina Parker', 'Hugo Evans', 'Iris Edwards',
    'Jake Collins', 'Kate Stewart', 'Leo Morris', 'Mia Rogers', 'Nick Reed',
    'Ora Cook', 'Pete Morgan', 'Rita Bell', 'Sam Murphy', 'Tara Bailey',
    'Ursula Rivera', 'Vince Cooper', 'Wendy Richardson', 'Xander Cox', 'Yoko Howard',
  ];

  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io', 'business.co'];

  const leads = names.map((name, i) => {
    const [firstName, lastName] = name.split(' ');
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${randomItem(domains)}`;
    return {
      name,
      email,
      status: randomItem(LEAD_STATUSES),
      source: randomItem(LEAD_SOURCES),
      phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
      company: `Company ${String.fromCharCode(65 + (i % 26))}`,
      notes: i % 3 === 0 ? `Interested in premium plan. Follow up by ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.` : undefined,
      assignedTo: i % 2 === 0 ? admin._id : salesUser._id,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    };
  });

  await Lead.insertMany(leads);
  console.log(`Seeded ${leads.length} leads`);

  console.log('\n─── Demo Credentials ───────────────────────');
  console.log('Admin:       admin@smartleads.dev / Admin@1234');
  console.log('Sales User:  sales@smartleads.dev / Sales@1234');
  console.log('─────────────────────────────────────────────\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
