import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDashboardStats extends Document {
  totalTrades: number;
  monthlyRevenue: number;
  activeShipments: number;
  tradeVolumeByCountry: { country: string; volume: number }[];
  lastUpdated: Date;
}

const DashboardStatsSchema: Schema = new Schema({
  totalTrades: { type: Number, default: 0 },
  monthlyRevenue: { type: Number, default: 0 },
  activeShipments: { type: Number, default: 0 },
  tradeVolumeByCountry: [{
    country: String,
    volume: Number
  }],
  lastUpdated: { type: Date, default: Date.now }
});

const DashboardStats: Model<IDashboardStats> = mongoose.models.DashboardStats || mongoose.model<IDashboardStats>('DashboardStats', DashboardStatsSchema, 'dashboard_stats');

export default DashboardStats;
