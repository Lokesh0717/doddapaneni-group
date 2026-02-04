import mongoose from 'mongoose';

export interface IPasswordChangeLog {
  _id: mongoose.Types.ObjectId;
  changedById: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  changedByRole: string;
  changedAt: Date;
  changedAtIST: string;
  changedAtET: string;
}

const passwordChangeLogSchema = new mongoose.Schema<IPasswordChangeLog>(
  {
    changedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    changedByRole: { type: String, required: true },
    changedAt: { type: Date, default: () => new Date() },
    changedAtIST: { type: String, required: true },
    changedAtET: { type: String, required: true },
  },
  { timestamps: false }
);

export const PasswordChangeLog =
  (mongoose.models.PasswordChangeLog as mongoose.Model<IPasswordChangeLog>) ??
  mongoose.model<IPasswordChangeLog>('PasswordChangeLog', passwordChangeLogSchema);
