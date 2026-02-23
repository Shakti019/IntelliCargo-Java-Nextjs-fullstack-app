import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITradeDraft extends Document {
  userId: string;
  formData: Record<string, any>;
  step: number;
  updatedAt: Date;
}

const TradeDraftSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  formData: { type: Schema.Types.Mixed, default: {} },
  step: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now }
});

const TradeDraft: Model<ITradeDraft> = mongoose.models.TradeDraft || mongoose.model<ITradeDraft>('TradeDraft', TradeDraftSchema, 'trade_drafts');

export default TradeDraft;
