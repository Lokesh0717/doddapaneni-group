import mongoose from 'mongoose';
import type { Role } from '@/lib/constants';

export interface IDashboardVisit {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  path: string;
  role: Role;
  visitedAt: Date;
  visitedAtIST: string;
  visitedAtET: string;
}

const dashboardVisitSchema = new mongoose.Schema<IDashboardVisit>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    path: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'DIGITAL_MARKETER'], required: true },
    visitedAt: { type: Date, default: () => new Date() },
    visitedAtIST: { type: String, required: true },
    visitedAtET: { type: String, required: true },
  },
  { timestamps: false }
);

export const DashboardVisit =
  (mongoose.models.DashboardVisit as mongoose.Model<IDashboardVisit>) ??
  mongoose.model<IDashboardVisit>('DashboardVisit', dashboardVisitSchema);
