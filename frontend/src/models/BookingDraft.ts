import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookingDraft extends Document {
  userId: string;
  shipmentDetails: Record<string, any>;
  step: number;
  updatedAt: Date;
}

const BookingDraftSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  shipmentDetails: { type: Schema.Types.Mixed, default: {} },
  step: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now }
});

const BookingDraft: Model<IBookingDraft> = mongoose.models.BookingDraft || mongoose.model<IBookingDraft>('BookingDraft', BookingDraftSchema, 'booking_drafts');

export default BookingDraft;
