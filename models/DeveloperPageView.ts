import mongoose from 'mongoose';

export interface IDeveloperPageView {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  loginLogId: mongoose.Types.ObjectId;
  path: string;
  visitedAt: Date;
  visitedAtIST: string;
  visitedAtET: string;
}

const developerPageViewSchema = new mongoose.Schema<IDeveloperPageView>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loginLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoginLog', required: true },
    path: { type: String, required: true },
    visitedAt: { type: Date, default: () => new Date() },
    visitedAtIST: { type: String, required: true },
    visitedAtET: { type: String, required: true },
  },
  { timestamps: false }
);

export const DeveloperPageView =
  (mongoose.models.DeveloperPageView as mongoose.Model<IDeveloperPageView>) ??
  mongoose.model<IDeveloperPageView>('DeveloperPageView', developerPageViewSchema);
