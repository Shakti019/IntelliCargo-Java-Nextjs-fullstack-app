import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string;
  action: string;
  entityType: string; // 'TRADE', 'SHIPMENT', 'USER'
  entityId: string;
  timestamp: Date;
  details?: Record<string, any>;
}

const ActivityLogSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Schema.Types.Mixed },
});

const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema, 'activity_logs');

export default ActivityLog;
