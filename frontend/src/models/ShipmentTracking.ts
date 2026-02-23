import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShipmentTracking extends Document {
  shipmentId: string;
  coordinates: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  currentCheckpointId?: string; // Node ID
  nextCheckpointId?: string;    // Node ID
  distanceToNext?: number;      // km
  estimatedArrival?: Date;
  checkpointStatus: string;     // 'IN_TRANSIT', 'ARRIVED_AT_CHECKPOINT', 'DEPARTED_CHECKPOINT', 'DELAYED'
  deviationFromRoute: number;   // meters/km
  speed: number;
  temperature?: number;
  status: string; // IN_TRANSIT, DELIVERED, etc.
  timestamp: Date;
}

const ShipmentTrackingSchema: Schema = new Schema({
  shipmentId: { type: String, required: true, index: true },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  
  // -- New Fields for Checkpoint Tracking --
  currentCheckpointId: { type: String, trim: true }, // ID of the checkpoint/node currently at or just passed
  nextCheckpointId: { type: String, trim: true },    // ID of the target checkpoint
  distanceToNext: { type: Number },                  // Kilometers
  estimatedArrival: { type: Date },                  // ETA at next checkpoint
  
  checkpointStatus: { 
    type: String, 
    enum: ['IN_TRANSIT', 'ARRIVED_AT_CHECKPOINT', 'DEPARTED_CHECKPOINT', 'DELAYED'],
    default: 'IN_TRANSIT'
  },
  
  // Deviation from official route (in meters/km)
  deviationFromRoute: { type: Number, default: 0 }, 

  speed: { type: Number, default: 0 },
  temperature: { type: Number },
  status: { type: String, required: true, default: 'IN_TRANSIT' },
  timestamp: { type: Date, default: Date.now },
});

// Create 2dsphere index for geospatial queries
ShipmentTrackingSchema.index({ coordinates: '2dsphere' });
// Compound index for efficient querying of history
ShipmentTrackingSchema.index({ shipmentId: 1, timestamp: -1 });

const ShipmentTracking: Model<IShipmentTracking> = mongoose.models.ShipmentTracking || mongoose.model<IShipmentTracking>('ShipmentTracking', ShipmentTrackingSchema, 'shipment_tracking');

export default ShipmentTracking;
