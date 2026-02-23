import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: string; // e.g., 'TRADE_UPDATE', 'SHIPMENT_ALERT', 'PAYMENT_RECEIVED'
  message: string;
  isRead: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema, 'notifications');

export default Notification;
