import mongoose from 'mongoose';

export interface IVisit {
  _id: mongoose.Types.ObjectId;
  visitedAt: Date;
  visitedAtIST: string;
  visitedAtET: string;
}

const visitSchema = new mongoose.Schema<IVisit>(
  {
    visitedAt: { type: Date, default: () => new Date(), required: true },
    visitedAtIST: { type: String, required: true },
    visitedAtET: { type: String, required: true },
  },
  { timestamps: false }
);

export const Visit =
  (mongoose.models.Visit as mongoose.Model<IVisit>) ??
  mongoose.model<IVisit>('Visit', visitSchema);
