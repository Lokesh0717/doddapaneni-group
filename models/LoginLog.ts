import mongoose from 'mongoose';

export interface ILoginLog {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  loggedAt: Date;
  loggedAtIST: string;
  loggedAtET: string;
  loggedOutAt?: Date | null;
  loggedOutAtIST?: string | null;
  loggedOutAtET?: string | null;
}

const loginLogSchema = new mongoose.Schema<ILoginLog>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loggedAt: { type: Date, default: () => new Date() },
    loggedAtIST: { type: String, required: true },
    loggedAtET: { type: String, required: true },
    loggedOutAt: { type: Date, default: null },
    loggedOutAtIST: { type: String, default: null },
    loggedOutAtET: { type: String, default: null },
  },
  { timestamps: false }
);

export const LoginLog =
  (mongoose.models.LoginLog as mongoose.Model<ILoginLog>) ??
  mongoose.model<ILoginLog>('LoginLog', loginLogSchema);
