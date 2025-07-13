import { Schema, model, Document } from 'mongoose';

export enum OrderStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export interface IOrder extends Document {
  order_id: string;
  amount: number;
  status: OrderStatus;
  timestamp: Date;
  vendor: Schema.Types.ObjectId; 
}

const orderSchema = new Schema({
  order_id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.Pending },
  timestamp: { type: Date, default: Date.now },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
});

export default model<IOrder>('Order', orderSchema);