import mongoose from 'mongoose';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended';

export interface ICampaign {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  url: string;
  status: CampaignStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdById: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new mongoose.Schema<ICampaign>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'ended'],
      default: 'draft',
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const Campaign =
  (mongoose.models.Campaign as mongoose.Model<ICampaign>) ??
  mongoose.model<ICampaign>('Campaign', campaignSchema);
