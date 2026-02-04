import mongoose from 'mongoose';

export interface IPageContent {
  _id: mongoose.Types.ObjectId;
  pageKey: string;
  locale: string;
  title: string;
  body: string;
  updatedAt: Date;
}

const pageContentSchema = new mongoose.Schema<IPageContent>(
  {
    pageKey: { type: String, required: true },
    locale: { type: String, required: true },
    title: { type: String, required: true, default: '' },
    body: { type: String, required: true, default: '' },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

pageContentSchema.index({ pageKey: 1, locale: 1 }, { unique: true });

export const PageContent =
  (mongoose.models.PageContent as mongoose.Model<IPageContent>) ??
  mongoose.model<IPageContent>('PageContent', pageContentSchema);
