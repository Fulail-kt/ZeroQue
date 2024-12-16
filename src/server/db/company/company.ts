// import mongoose, { Document, Model, Schema } from 'mongoose';

// // Define an interface for the Company document
// interface ICompany extends Document {
//   email: string;
//   name: string;
//   password: string;
//   profile?: string;
// }

// // Create the schema
// const CompanySchema = new Schema<ICompany>({
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
//   name: { 
//     type: String, 
//     required: true 
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   profile: { 
//     type: String, 
//     default: '' 
//   }
// });

// // Create and export the model with proper typing
// export const CompanyModel = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);


// import mongoose, { Document, Model, Schema } from 'mongoose';

// export interface ICompany extends Document {
//   email: string;
//   name: string;
//   routeName:string;
//   password?: string;
//   profile?: string;
//   isVerified?: boolean;
//   _id: string;
//   googleId?: string;
//   authProvider: 'credentials' | 'google';
//   userRole: 'user' | 'ADMIN' | 'COMPANY';
// }

// const CompanySchema = new Schema<ICompany>({
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   name: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   routeName: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   password: { 
//     type: String, 
//     required: function() {
//       return this.authProvider === 'credentials';
//     }
//   },
//   profile: { 
//     type: String, 
//     default: '' 
//   },
//   isVerified:{
//     type: Boolean,
//     default: false
//   },
//   googleId: {
//     type: String,
//     unique: true,
//     sparse: true 
//   },
//   authProvider: {
//     type: String,
//     enum: ['credentials', 'google'],
//     default: 'credentials'
//   },
//   userRole: {
//     type: String,
//     enum: ['user', 'ADMIN', 'COMPANY'], // customize as needed
//     default: 'user'
//   },
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Add a static method to find by email
// CompanySchema.statics.findByEmail = async function(email: string) {
//   return this.findOne({ email: email.toLowerCase() });
// };

// interface CompanyModel extends Model<ICompany> {
//   findByEmail(email: string): Promise<ICompany | null>;
// }

// export const CompanyModel = (mongoose.models.Company as unknown as CompanyModel) || 
//   mongoose.model<ICompany, CompanyModel>('Company', CompanySchema);



import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICompany extends Document {
  email: string;
  name: string;
  routeName: string;
  password?: string;
  profile?: string;
  isVerified?: boolean;
  _id: string;
  googleId?: string;
  authProvider: 'credentials' | 'google';
  userRole: 'user' | 'ADMIN' | 'COMPANY';
  createdAt?: Date; 
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
  routeName: { 
    type: String, 
    required: true,
    trim: true
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