
import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { ICategory, ISubcategory } from '../category/category';

// Define the Size Type interface
interface ISize {
  _id?: Types.ObjectId;
  name: string;
  stock: number;
  price: number;
}

// Define the Product Type interface
interface IProduct extends Document {
  title: string;
  description: string;
  images: string[];
  category: Types.ObjectId | ICategory;
  subcategory?: Types.ObjectId | ISubcategory | null;
  sizes: ISize[]; // Remove optional to resolve type issues
  price?: number;
  stock?: number;
  company: Types.ObjectId;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  totalInventory: number; // Remove optional
}

// Define the static methods for the model interface
interface ProductModelType extends Model<IProduct> {
  findByCategory(categoryId: string): Promise<IProduct[]>;
}

// Define the Size Schema
const SizeSchema = new Schema<ISize>({
  name: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
});

// Define the Product Schema
const ProductSchema = new Schema<IProduct, ProductModelType>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [
      {
        type: String,
        required: true,
        validate: {
          validator: (v: string) => /^https?:\/\//.test(v),
          message: 'Image must be a valid URL',
        },
      },
    ],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    sizes: { type: [SizeSchema], default: [] },
    price: {
      type: Number,
      required: function(this: IProduct) {
        // Price is required only when no sizes are present
        return !this.sizes || this.sizes.length === 0;
      },
      min: 0
    },
    stock: {
      type: Number,
      required: function(this: IProduct) {
        // Price is required only when no sizes are present
        return !this.sizes || this.sizes.length === 0;
      },
      min: 0
    },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a virtual field to calculate total inventory
ProductSchema.virtual('totalInventory').get(function(this: IProduct) {
  // If sizes exist, calculate total from sizes
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  // If no sizes, return 0
  return 0;
});

// Instance method to check if a specific size is available
ProductSchema.methods.isSizeAvailable = function(
  this: IProduct, 
  sizeId: Types.ObjectId
) {
  const size = this.sizes.find((s) => s._id?.equals(sizeId));
  return size ? size.stock > 0 : false;
};

// Static method to find products by category
ProductSchema.statics.findByCategory = function(
  this: ProductModelType, 
  categoryId: string
) {
  return this.find({ category: categoryId });
};

// Compile the model
export const ProductModel = 
  (mongoose.models.Product as ProductModelType) || 
  mongoose.model<IProduct, ProductModelType>('Product', ProductSchema);

export type { IProduct, ISize };