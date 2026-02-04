/**
 * Reset MongoDB: delete all data from all collections, then create one Super Admin user.
 * Run: node scripts/reset-and-seed.mjs
 *
 * Requires in .env.local (or .env):
 *   SUPER_ADMIN_EMAIL    - Super Admin login email
 *   SUPER_ADMIN_PASSWORD - Super Admin login password (min 6 chars)
 *   SUPER_ADMIN_NAME     - Display name for the Super Admin
 *
 * Also uses DATABASE_URL or MONGODB_URI for the database connection.
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

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL?.trim();
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME?.trim() ?? null;
const SUPER_ADMIN_ROLE = 'SUPER_ADMIN';

if (!SUPER_ADMIN_EMAIL) {
  console.error('Missing SUPER_ADMIN_EMAIL. Set it in .env.local (e.g. SUPER_ADMIN_EMAIL=you@example.com)');
  process.exit(1);
}
if (!SUPER_ADMIN_PASSWORD || String(SUPER_ADMIN_PASSWORD).length < 6) {
  console.error('Missing or invalid SUPER_ADMIN_PASSWORD (min 6 characters). Set it in .env.local.');
  process.exit(1);
}

/** Mask email for logs: "ab***@domain.com" */
function maskEmail(email) {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return '***@' + domain;
  return local.slice(0, 2) + '***@' + domain;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: null },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER'], default: 'DEVELOPER' },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAtIST: { type: String, default: null },
    createdAtET: { type: String, default: null },
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
const User = mongoose.models.User ?? mongoose.model('User', userSchema);

/** Format date in IST (e.g. "1 Feb 2026, 15:45 IST") */
function formatInIST(date) {
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }) + ' IST';
}

/** Format date in ET (e.g. "Feb 1, 2026, 05:15 ET") */
function formatInET(date) {
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: false,
    timeZone: 'America/New_York',
  }) + ' ET';
}

async function main() {
  const dbName = (MONGODB_URI.match(/\/([^/?]+)(\?|$)/) || [])[1] || 'doddapaneni_group';
  console.log('Connecting to MongoDB...', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const names = collections.map((c) => c.name);

  console.log('Deleting all data from collections:', names.join(', ') || '(none)');
  for (const name of names) {
    await db.collection(name).deleteMany({});
    console.log('  Cleared:', name);
  }

  const createdAt = new Date();
  const passwordHash = await bcrypt.hash(String(SUPER_ADMIN_PASSWORD), 10);
  const emailLower = SUPER_ADMIN_EMAIL.toLowerCase().trim();

  console.log('Creating Super Admin user:', maskEmail(emailLower));
  await User.create({
    email: emailLower,
    passwordHash,
    name: SUPER_ADMIN_NAME,
    role: SUPER_ADMIN_ROLE,
    createdAtIST: formatInIST(createdAt),
    createdAtET: formatInET(createdAt),
  });

  console.log('Done.');
  console.log('Database "' + dbName + '" has been reset and now has 1 user (Super Admin).');
  console.log('');
  console.log('Login with the SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD from your .env.local.');
  console.log('Go to /en/login (or your locale) to sign in.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
