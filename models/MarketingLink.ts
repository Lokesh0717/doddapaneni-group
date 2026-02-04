import mongoose from 'mongoose';

export type MarketingLinkType = 'tool' | 'integration' | 'resource' | 'other';

export interface IMarketingLink {
  _id: mongoose.Types.ObjectId;
  name: string;
  url: string;
  description: string;
  type: MarketingLinkType;
  createdById: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const marketingLinkSchema = new mongoose.Schema<IMarketingLink>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['tool', 'integration', 'resource', 'other'],
      default: 'resource',
    },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const MarketingLink =
  (mongoose.models.MarketingLink as mongoose.Model<IMarketingLink>) ??
  mongoose.model<IMarketingLink>('MarketingLink', marketingLinkSchema);
