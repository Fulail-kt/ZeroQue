// import mongoose, { Document, Model } from 'mongoose';

// // Define the TypeScript interface for the Order document
// interface OrderDocument extends Document {
//     _id:mongoose.Schema.Types.ObjectId,
//   userId?: mongoose.Schema.Types.ObjectId;
//   name: string;
//   email: string;
//   phone1: string;
//   phone2?: string;
//   tableNumber?: string;
//   items: {
//     id: string;
//     title: string;
//     price: number;
//     quantity: number;
//   }[];
//   total: number;
//   paymentMethod: 'cash' | 'online';
//   payment: {
//     method: {
//       type: String,
//       required: true,
//       enum: ['cash', 'online'],
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ['pending', 'completed', 'failed'],
//       default: 'pending',
//     },
//     transactionId: String,
//     upiId: String,
//     refNumber: String,
//     attempts: {
//       type: Number,
//       default: 0,
//     },
//     lastAttempt: {
//       type: Date,
//     },
//     error: String,
//     // metadata: {
//     //   type: Map,
//     //   of: Schema.Types.Mixed,
//     // },
//   },
//   transactionId: string;
//   coupon?: {
//     code?: string;
//     discount?: number;
//   }
//   status: 'pending' | 'processing' | 'completed' | 'cancelled'|'failed';
//   createdAt?: Date;
//   updatedAt?: Date;
//   preparationStartTime: Date,
//   completionTime: Date,
//   estimatedTime: Number,
// }

// // Define the model type
// export type OrderModelType = Model<OrderDocument>;

// // Define the schema
// const OrderSchema = new mongoose.Schema<OrderDocument>({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone1: { type: String, required: true },
//   phone2: { type: String, required: false },
//   tableNumber: { type: String, required: false },
//   items: [
//     {
//       id: { type: String, required: true },
//       title: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   total: { type: Number, required: true },
//   paymentMethod: { type: String, enum: ['cash', 'online'], required: true },
//   transactionId: { type: String, required: true },
//   coupon: {
//     code: { type: String },
//     discount: { type: Number, default: 0 },
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'completed', 'cancelled'],
//     default: 'pending',
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Export the model
// export const OrderModel: OrderModelType =
//   mongoose.models.Order ?? mongoose.model<OrderDocument, OrderModelType>('Order', OrderSchema);

import mongoose, { Document, Model, Schema, Types } from 'mongoose';

interface OrderDocument extends Document {
  _id: Types.ObjectId;
  // userId?: Types.ObjectId;
  companyId: Types.ObjectId;
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
  payment: {
    method: 'cash' | 'online'|'upi';
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    upiId?: string;
    refNumber?: string;
    attempts: number;
    lastAttempt?: Date;
    error?: string;
    expiresAt?: Date;
    qrCode?: string;
    upiUrl?: string;
    
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'|'failed';
  coupon?: {
    code?: string;
    discount?: number;
  };
  paymentAttempts: number;
  lastPaymentAttempt?: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
  preparationStartTime?: Date;
  completionTime?: Date;
  estimatedTime?: number;
}
export interface OrderModelType extends Model<OrderDocument> {
  build(attrs: Partial<OrderDocument>): OrderDocument;
}

const OrderSchema = new Schema<OrderDocument, OrderModelType>(
  {
    // userId: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone1: { type: String, required: true },
    phone2: { type: String },
    tableNumber: { type: String },
    items: [{
      id: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }],
    total: { type: Number, required: true },
    payment: {
      method: { type: String, enum: ['cash', 'online','upi'], required: true },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      transactionId: { type: String },
      upiId: { type: String },
      refNumber: { type: String },
      attempts: { type: Number, default: 0 },
      lastAttempt: { type: Date },
      error: { type: String },
      expiresAt: { type: Date },
      qrCode: { type: String },
      upiUrl: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled','failed'],
      default: 'pending',
      required: true,
    },
    coupon: {
      code: { type: String },
      discount: { type: Number, default: 0 },
    },
    paymentAttempts: { type: Number, default: 0 },
    lastPaymentAttempt: { type: Date },
    lastError: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    preparationStartTime: { type: Date },
    completionTime: { type: Date },
    estimatedTime: { type: Number },
  },
  { 
    timestamps: true,
    collection: 'orders'
  }
);

// Create indexes for better query performance
OrderSchema.index({ companyId: 1, createdAt: -1 });
OrderSchema.index({ 'payment.refNumber': 1 });
OrderSchema.index({ status: 1 });

// Add a static method to build a new order with proper typing
OrderSchema.statics.build = function(attrs: Partial<OrderDocument>) {
  return new this(attrs);
};

// Export the model with proper typing
export const OrderModel = (mongoose.models.Order as OrderModelType) || 
  mongoose.model<OrderDocument, OrderModelType>('Order', OrderSchema);