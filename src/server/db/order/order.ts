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
    intentData?: {  // Add this new field
      pa: string;   // Payee address (UPI ID)
      pn: string;   // Payee name
      tr: string;   // Transaction reference
      am: string;   // Amount
      cu: string;   // Currency
      mc: string;   // Merchant code
      tn: string;   // Transaction note
      mode?: string;
      purpose?: string;
    };
    
  };
  status: 'pending' |'confirmed'| 'preparing' | 'ready'|"cancelled" ;
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
      intentData: {  
        pa: { type: String },
        pn: { type: String },
        tr: { type: String },
        am: { type: String },
        cu: { type: String },
        mc: { type: String },
        tn: { type: String },
        mode: { type: String },
        purpose: { type: String },
      }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready',"cancelled"],
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