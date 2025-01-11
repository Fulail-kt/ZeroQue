import mongoose, { Document, Model, Schema,ObjectId } from 'mongoose';

// Add timestamps to the interface
export interface ICompany extends Document {
  email: string;
  name: string;
  phone: number;
  routeName: string;
  upiId?: string;
  qrCode?: {qr:string,updated:Date,url:string};
  password?: string;
  profile?: string;
  isVerified?: boolean;
  _id: string;
  googleId?: string;
  authProvider: 'credentials' | 'google';
  userRole: 'user' | 'ADMIN' | 'COMPANY';
  banners?:[{_id:string, title:string,url:string,isActive:boolean}]
  onBoarding: boolean;
  createdAt: Date;  
  updatedAt: Date;  
}

const CompanySchema = new Schema<ICompany>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: Number, 
    required: false,
    trim: true
  },
  routeName: { 
    type: String, 
    required: true,
    trim: true
  },
  upiId:{
    type: String,
    required: false,
    trim: true
  },
  qrCode:{
    qr:{type:String},updated:{type:Date},url:{type:String}
  },
  password: { 
    type: String, 
    required: function() {
      return this.authProvider === 'credentials';
    }
  },
  profile: { 
    type: String, 
    default: '' 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true 
  },
  authProvider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials'
  },
  userRole: {
    type: String,
    enum: ['user', 'ADMIN', 'COMPANY'],
    default: 'user'
  },
  onBoarding: {
    type: Boolean,
    default: false
  },
  banners:[{title:{type:String},url:{type:String},isActive:{type:Boolean,default:true}}]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a TTL index for unverified companies
CompanySchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 24 * 60 * 60, // 24 hours
  partialFilterExpression: { isVerified: false } 
});

// Add a static method to find by email
CompanySchema.statics.findByEmail = async function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

interface CompanyModel extends Model<ICompany> {
  findByEmail(email: string): Promise<ICompany | null>;
}

export const CompanyModel = (mongoose.models.Company as unknown as CompanyModel) || 
  mongoose.model<ICompany, CompanyModel>('Company', CompanySchema);