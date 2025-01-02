import mongoose, { Document, Model } from 'mongoose';

// Define the TypeScript interface for the Order document
interface OrderDocument extends Document {
    _id:mongoose.Schema.Types.ObjectId,
  userId?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMethod: 'cash' | 'online';
  transactionId: string;
  coupon?: {
    code?: string;
    discount?: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled'|'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the model type
export type OrderModelType = Model<OrderDocument>;

// Define the schema
const OrderSchema = new mongoose.Schema<OrderDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone1: { type: String, required: true },
  phone2: { type: String, required: false },
  tableNumber: { type: String, required: false },
  items: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'online'], required: true },
  transactionId: { type: String, required: true },
  coupon: {
    code: { type: String },
    discount: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export the model
export const OrderModel: OrderModelType =
  mongoose.models.Order ?? mongoose.model<OrderDocument, OrderModelType>('Order', OrderSchema);
