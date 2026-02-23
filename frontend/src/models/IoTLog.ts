import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIoTLog extends Document {
  shipmentId: string;
  deviceId: string;
  type: string; // 'TEMPERATURE', 'HUMIDITY', 'SHOCK', 'DOOR_OPEN'
  value: number;
  unit: string;
  
  coordinates?: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };

  alertTriggered: boolean;
  timestamp: Date;
}

const IoTLogSchema: Schema = new Schema({
  shipmentId: { type: String, required: true, index: true },
  deviceId: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['TEMPERATURE', 'HUMIDITY', 'SHOCK', 'DOOR_OPEN', 'BATTERY', 'PRESSURE']
  },
  value: { type: Number, required: true },
  unit: { type: String },
  
  coordinates: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } // Optional location of sensor event
  },
  
  alertTriggered: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

IoTLogSchema.index({ shipmentId: 1, type: 1, timestamp: -1 });

const IoTLog: Model<IIoTLog> = mongoose.models.IoTLog || mongoose.model<IIoTLog>('IoTLog', IoTLogSchema, 'iot_logs');

export default IoTLog;
