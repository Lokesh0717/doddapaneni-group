/**
 * Get user by email including passwordHash (for login).
 */

import { User } from '@/models';
import { connectDb } from './mongodb';

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  passwordHash: string;
};

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  await connectDb();
  const doc = await User.findOne({ email: email.toLowerCase().trim() })
    .select('+passwordHash')
    .lean();
  if (!doc) return null;
  return {
    id: String(doc._id),
    email: doc.email,
    name: doc.name ?? null,
    role: doc.role,
    passwordHash: doc.passwordHash,
  };
}
