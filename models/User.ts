import mongoose from 'mongoose';
import type { Role } from '@/lib/constants';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  createdById?: mongoose.Types.ObjectId | null;
  /** Creation time in IST (for display). */
  createdAtIST?: string | null;
  /** Creation time in ET (for display). */
  createdAtET?: string | null;
  /** Set whenever the user's password is changed (by admin or self). */
  passwordChangedAt?: Date | null;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, default: null },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER'],
      default: 'DEVELOPER',
    },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAtIST: { type: String, default: null },
    createdAtET: { type: String, default: null },
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ?? mongoose.model<IUser>('User', userSchema);
