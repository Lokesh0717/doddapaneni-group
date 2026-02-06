/**
 * Seed one user per role if not present (4 distinct emails).
 * Run: node scripts/seed.mjs   OR   npm run db:seed
 * Requires: DATABASE_URL or MONGODB_URI
 * Does not delete existing users; only adds missing ones.
 *
 * Super Admin (default): lk8772000@gmail.com / 123456
 * Override with SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD env vars.
 * Other roles: Admin, Developer, Digital Marketer (see SEED_USERS below).
 */

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
config({ path: path.join(projectRoot, '.env.local') });
config({ path: path.join(projectRoot, '.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI =
  process.env.DATABASE_URL ??
  process.env.MONGODB_URI ??
  'mongodb://127.0.0.1:27017/doddapaneni_group';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: null },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER'], default: 'DEVELOPER' },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);
const User = mongoose.models.User ?? mongoose.model('User', userSchema);

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD ?? '123';
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? 'lk8772000@gmail.com';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? '123456';

const SEED_USERS = [
  { email: SUPER_ADMIN_EMAIL, name: 'Super Admin', role: 'SUPER_ADMIN', password: SUPER_ADMIN_PASSWORD },
  { email: process.env.ADMIN_EMAIL ?? 'admin@doddapaneni-group.com', name: 'Admin', role: 'ADMIN', password: DEFAULT_PASSWORD },
  { email: process.env.DEVELOPER_EMAIL ?? 'developer@doddapaneni-group.com', name: 'Developer', role: 'DEVELOPER', password: DEFAULT_PASSWORD },
  { email: process.env.MARKETER_EMAIL ?? 'marketer@doddapaneni-group.com', name: 'Digital Marketer', role: 'DIGITAL_MARKETER', password: DEFAULT_PASSWORD },
];

async function main() {
  await mongoose.connect(MONGODB_URI);

  for (const u of SEED_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      await User.create({
        email: u.email,
        passwordHash: await bcrypt.hash(u.password, 10),
        name: u.name,
        role: u.role,
      });
      console.log('Created', u.role, 'user:', u.email);
    } else {
      console.log(u.role, 'user already exists:', u.email);
    }
  }

  console.log('Seed done. Each role has a different login email. Go to /en/login to sign in.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
