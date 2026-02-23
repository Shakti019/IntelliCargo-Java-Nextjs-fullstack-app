import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRouteDeviation extends Document {
  shipmentId: string;
  timestamp: Date;
  coordinates: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
  deviatedDistanceKm: number; // How far from the official route
  nearestPlannedNodeId: string;
  detectedReason?: string; // e.g. "Congestion Avoidance", "Accident Detour", "Unknown"
  acknowledged: boolean;
}

const RouteDeviationSchema: Schema = new Schema({
  shipmentId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  deviatedDistanceKm: { type: Number, required: true },
  nearestPlannedNodeId: { type: String, required: true },
  detectedReason: { type: String },
  acknowledged: { type: Boolean, default: false }
});

RouteDeviationSchema.index({ shipmentId: 1, acknowledged: 1 });

const RouteDeviation: Model<IRouteDeviation> = mongoose.models.RouteDeviation || mongoose.model<IRouteDeviation>('RouteDeviation', RouteDeviationSchema, 'route_deviations');

export default RouteDeviation;
