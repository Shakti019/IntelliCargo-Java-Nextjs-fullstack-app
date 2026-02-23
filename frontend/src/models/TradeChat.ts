import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITradeChat extends Document {
  tradeId: string;
  senderId: string;
  message: string;
  attachments: string[];
  timestamp: Date;
}

const TradeChatSchema: Schema = new Schema({
  tradeId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  attachments: { type: [String], default: [] }, // S3/Storage URLs
  timestamp: { type: Date, default: Date.now, index: true },
});

// Check if model exists before creating to prevent overwrite error in hot reload
const TradeChat: Model<ITradeChat> = mongoose.models.TradeChat || mongoose.model<ITradeChat>('TradeChat', TradeChatSchema, 'trade_chats');

export default TradeChat;
