// import mongoose from "mongoose";
// const { Schema } = mongoose;

// // Define the subcategory schema
// const SubcategorySchema = new Schema({
//   name: { type: String, required: true },
//   description: { type: String },
// }, { timestamps: true });

// // Define the category schema, embedding the subcategories
// const CategorySchema = new Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   subcategories: [SubcategorySchema],
//   isActive: { type: Boolean, default: true }, 
// }, { timestamps: true });

// // Create the model
// const CategoryModel= mongoose.models.Category || mongoose.model('Category', CategorySchema);
// export default CategoryModel;


import mongoose, { Document, Model, Schema, Types } from "mongoose";

// Define an interface for the Subcategory
interface ISubcategory {
  _id:Types.ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define an interface for the Category
interface ICategory extends Document {
  name: string;
  description?: string;
  subcategories: ISubcategory[];
  isActive?: boolean;
  company: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the subcategory schema
const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

// Define the category schema, embedding the subcategories
const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  subcategories: [SubcategorySchema],
  isActive: { type: Boolean, default: true }, 
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });

// Create the model with explicit type
const CategoryModel: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;
export type { ICategory, ISubcategory };