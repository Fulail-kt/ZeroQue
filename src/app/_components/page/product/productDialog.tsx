// 'use client'
// import React, { useEffect, useState } from 'react'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '~/components/ui/form'
// import { Input } from '~/components/ui/input'
// import { Button } from '~/components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '~/components/ui/select'
// import { Trash2, Plus, Loader2 } from 'lucide-react'
// import { api } from '~/trpc/react'
// import 'react-image-crop/dist/ReactCrop.css'
// import ImageCropper from '../../global/imageCropper'

// // Update product schema to use file upload for image
// const productSchema = z.object({
//   _id: z.string().optional(),
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(1, "Description is required"),
//   images: z.array(z.string()).max(3, "Maximum 3 images allowed"),
//   category: z.string().min(1, "Category is required"),
//   subcategory: z.string().optional(),
//   sizes: z
//     .array(
//       z.object({
//         _id: z.string().optional(),
//         name: z.string()
//           .min(1, "Size name is required")
//           .refine(
//             value => /^[a-zA-Z0-9\s]+$/.test(value), 
//             { message: "Size name can only contain letters, numbers, and spaces" }
//           ),
//         stock: z.number()
//           .int()
//           .min(0, "Stock cannot be negative")
//           .max(1000, "Maximum stock is 1000"),
//         price: z.number()
//           .positive("Price must be positive")
//           .max(100000, "Price is too high")
//       })
//     )
//     .optional()
//     .refine(
//       (sizes) => !sizes || sizes.length === 0 || sizes.every(size => 
//         size.name.trim() !== '' && 
//         size.stock > 0 && 
//         size.price > 0
//       ), 
//       { 
//         message: "All size fields must be filled when sizes are added",
//         path: ["sizes"]
//       }
//     )
// });




// interface ProductSize {
//   _id?: string;
//   name: string;
//   stock: number;
//   price: number;
// }

// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   images: string[];
//   category: {
//     _id: string;
//     name: string;
//   };
//   subcategory?: {
//     _id: string;
//     name: string;
//   };
//   sizes: ProductSize[];
//   isDisabled?: boolean;
// }




// export const ProductDialog: React.FC<{
//   action: 'create' | 'edit';
//   initialData?: Product;
//   onClose: () => void;
// }> = ({
//   action,
//   initialData,
//   onClose
// }) => {
//     const utils = api.useUtils();
//     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//     const [images, setImages] = useState<string[]>([]);
//     const [showSizes, setShowSizes] = useState<boolean>(false);

//     // Create mutation
//     const createProduct = api.product.createProduct.useMutation({
//       onSuccess: () => {
//         utils.product.getProducts.refetch();
//         onClose();
//       },
//       onError: (error) => {
//         console.error(error);
//       }
//     });

//     // Edit mutation
//     const updateProduct = api.product.updateProduct.useMutation({
//       onSuccess: () => {
//         utils.product.getProducts.refetch();
//         onClose();
//       },
//       onError: (error) => {
//         console.error(error);
//       }
//     });

//     // GET categories
//     const { data: categoriesData, isLoading: categoriesLoading } =
//       api.product.getCategories.useQuery({
//         companyId: '674ac8e13644f51bd33ad5a0'
//       });

//       const form = useForm<z.infer<typeof productSchema>>({
//         resolver: zodResolver(productSchema),
//         defaultValues: {
//           title: initialData?.title || '',
//           description: initialData?.description || '',
//           images: initialData?.images || [],
//           category: initialData?.category?._id || '',
//           subcategory: initialData?.subcategory?._id || '',
//           sizes: initialData?.sizes?.length
//             ? initialData.sizes.map((size) => ({
//                 _id: size._id,
//                 name: size.name,
//                 stock: size.stock,
//                 price: size.price
//               }))
//             : []
//         }
//       });
      
//        // Get subcategories for the selected category
//     const subcategories = categoriesData?.categories.find(cat => cat?._id === selectedCategory)?.subcategories || [];
      
//       // In your component
//       useEffect(() => {
//         if (initialData?.images) {
//           setImages(initialData.images);
//         }
//         if (initialData?.category?._id) {
//           setSelectedCategory(initialData.category._id);
//         }
//       }, [initialData]);
      
      
//       useEffect(() => {
//         if (selectedCategory) {
//           const subcategoriesExist = subcategories.length > 0;
//           // Dynamically set subcategory field validation
//           form.setValue('subcategory', subcategoriesExist ? form.getValues('subcategory') : '');
//         }
//       }, [selectedCategory, subcategories]);

//     const handleImageCropped = (croppedImage: string) => {
//       if (images.length < 3) {
//         setImages(prev => [...prev, croppedImage]);
//         form.setValue('images', [...images, croppedImage]);
//       }
//     };

//     const removeImage = (indexToRemove: number) => {
//       const updatedImages = images.filter((_, index) => index !== indexToRemove);
//       setImages(updatedImages);
//       form.setValue('images', updatedImages);
//     };

//     console.log(form.formState,"state",form.formState.isDirty)
//     console.log(form.formState.errors)
//     const onSubmit = (data: z.infer<typeof productSchema>) => {
//       console.log(form.formState,"state")
//       const companyId = '674ac8e13644f51bd33ad5a0';
//       const submitData = {
//         ...data,
//         category: data.category || initialData?.category?._id || '',
//         companyId
//       };

//       if (action === 'create') {
//         createProduct.mutate(submitData);
//       } else {
//         updateProduct.mutate({
//           ...submitData,
//           productId: initialData?._id as string
//         });
//       }
//     };

//     // Detect loading state
//     const isLoading =
//       action === 'create'
//         ? createProduct.status === 'pending'
//         : updateProduct.status === 'pending';

   
//     const sizes=form.watch('sizes') || []
//     return (
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">

//           <div className='space-y-4 max-h-80 overflow-y-auto scrollbar-none p-2'>
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter product title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className={`grid  ${subcategories.length > 0 ? 'grid-cols-2' : ''} gap-2`}>
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <Select
//                       onValueChange={(value) => {
//                         field.onChange(value);
//                         setSelectedCategory(value);
//                         // Reset subcategory when category changes
//                         form.setValue('subcategory', '');
//                       }}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categoriesData?.categories.map((category) => {
//                           if (!category || typeof category._id !== 'string') return null;
//                           return (
//                             <SelectItem
//                               key={category._id}
//                               value={category._id}
//                             >
//                               {category.name}
//                             </SelectItem>
//                           );
//                         })}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* Subcategory Select - Only render if subcategories exist */}
//               {subcategories.length > 0 && (
//                 <FormField
//                   control={form.control}
//                   name="subcategory"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Subcategory</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select subcategory" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {subcategories.map((subcategory) => (
//                             <SelectItem
//                               key={subcategory._id.toString()}
//                               value={subcategory._id.toString()}
//                             >
//                               {subcategory.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )}
//             </div>
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter product description" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Image Upload Section */}
//             <div>
//               <FormLabel>Product Images (Max 3)</FormLabel>
//               <div className="grid grid-cols-3 gap-2 mb-2">
//                 {images.map((image, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={image}
//                       alt={`Product ${index + 1}`}
//                       className="w-full h-24 object-cover rounded"
//                     />
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       className="absolute top-0 right-0 m-1"
//                       onClick={() => removeImage(index)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//                 {images.length < 3 && (
//                   <ImageCropper
//                     onImageCropped={handleImageCropped}
//                     aspectRatio={1}
//                     minDimension={150}
//                   />
//                 )}
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <h3 className="text-lg font-semibold">Sizes <span className='text-xs tracking-wide'>(Optional)</span></h3>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   disabled={sizes.length >= 6}
//                   onClick={() => {
//                     const sizes = form.getValues('sizes')??[];
//                     if (sizes?.length < 6) {
//                       form.setValue('sizes', [...sizes, { name: '', stock: 0, price: 0 }]);
//                       setShowSizes(true);
//                     }
//                   }}
//                 >
//                   <Plus className="mr-2 h-4 w-4" /> Add Size
//                 </Button>
//               </div>
//               {sizes.length > 0 &&
//                 sizes.map((_, index) => (
//                   <div
//                     key={form.getValues(`sizes.${index}._id`) || `size-${index}`}
//                     className="grid grid-cols-4 gap-2 mb-2"
//                   >
//                     {/* Size Name */}
//                     <FormField
//                       control={form.control}
//                       name={`sizes.${index}.name`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input placeholder="Size" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     {/* Stock */}
//                     <FormField
//                       control={form.control}
//                       name={`sizes.${index}.stock`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               placeholder="Stock"
//                               {...field}
//                               onChange={(e) => field.onChange(Number(e.target.value))}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     {/* Price */}
//                     <FormField
//                       control={form.control}
//                       name={`sizes.${index}.price`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               placeholder="Price"
//                               {...field}
//                               onChange={(e) => field.onChange(Number(e.target.value))}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     {/* Remove Button */}
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => {
//                         const sizes = form.getValues('sizes');
//                         const updatedSizes = sizes?.filter((_, i) => i !== index);
//                         form.setValue('sizes', updatedSizes);
//                         // Hide size fields if all rows are removed
//                         if (updatedSizes?.length === 0) {
//                           setShowSizes(false);
//                         }
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               {/* Validation Message */}
//               {!showSizes && (
//               <p className="text-sm text-yellow-500 mt-1">
//                 Click "Add Size" to specify product sizes
//               </p>
//             )}
//             </div>
//           </div>


//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
//               </>
//             ) : (
//               action === 'create' ? 'Create Product' : 'Update Product'
//             )}
//           </Button>
//         </form>
//       </Form>
//     )
//   }

// export default ProductDialog
// 'use client'
// import React, { useEffect, useState } from 'react'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '~/components/ui/form'
// import { Input } from '~/components/ui/input'
// import { Button } from '~/components/ui/button'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '~/components/ui/select'
// import { Trash2, Plus, Loader2 } from 'lucide-react'
// import { api } from '~/trpc/react'
// import { ISubcategory } from '~/server/db/category/category'

// // Update product schema to use string for category and subcategory
// const productSchema = z.object({
//   _id: z.string().optional(),
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(1, "Description is required"),
//   image: z.string().url("Invalid image URL"),
//   category: z.string().min(1, "Category is required").optional(),
//   subcategory: z.string().min(1, "Subcategory is required"),
//   sizes: z.array(z.object({
//     _id: z.string().optional(),
//     name: z.string().min(1, "Size name is required"),
//     stock: z.number().int().min(0, "Stock cannot be negative"),
//     price: z.number().positive("Price must be positive")
//   })).min(1, "At least one size is required")
// })

// interface ProductSize {
//   _id?: string;
//   name: string;
//   stock: number;
//   price: number;
// }

// interface Product {
//   _id: string;
//   title: string;
//   description: string;
//   image: string;
//   category: {
//     _id: string;
//     name: string;
//   };
//   subcategory?: {
//     _id: string;
//     name: string;
//   };
//   sizes: ProductSize[];
//   isDisabled?: boolean;
// }

// interface ProductDialogProps {
//   action: 'create' | 'edit';
//   initialData?: Product;
//   onClose: () => void;
// }

// export const ProductDialog: React.FC<ProductDialogProps> = ({
//   action,
//   initialData,
//   onClose
// }) => {
//   const utils = api.useUtils();
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//   // Create mutation
//   const createProduct = api.product.createProduct.useMutation({
//     onSuccess: () => {
//       utils.product.getProducts.refetch();
//       onClose();
//     },
//     onError: (error) => {
//       console.error(error);
//     }
//   });

//   // Edit mutation
//   const updateProduct = api.product.updateProduct.useMutation({
//     onSuccess: () => {
//       utils.product.getProducts.refetch();
//       onClose();
//     },
//     onError: (error) => {
//       console.error(error);
//     }
//   });

//   // GET categories
//   const { data: categoriesData, isLoading: categoriesLoading } =
//     api.product.getCategories.useQuery({
//       companyId: '674ac8e13644f51bd33ad5a0'
//     });

//   const form = useForm<z.infer<typeof productSchema>>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       title: initialData?.title || '',
//       description: initialData?.description || '',
//       image: initialData?.image || '',
//       category: initialData?.category?._id || '',
//       subcategory: initialData?.subcategory?._id || '',
//       sizes: initialData?.sizes?.length
//         ? initialData.sizes.map(size => ({
//           _id: size._id,
//           name: size.name,
//           stock: size.stock,
//           price: size.price
//         }))
//         : [{ name: '', stock: 0, price: 0 }]
//     }
//   });

//   const onSubmit = (data: z.infer<typeof productSchema>) => {
//     const companyId = '674ac8e13644f51bd33ad5a0';
//     // Ensure category is always a string
//     const submitData = {
//       ...data,
//       category: data.category || initialData?.category?._id || '',
//       companyId
//     };
//     if (action === 'create') {
//       createProduct.mutate(submitData);
//     } else {
//       updateProduct.mutate({
//         ...submitData,
//         productId: initialData?._id as string
//       });
//     }
//   };

//   // Detect loading state
//   const isLoading =
//     action === 'create'
//       ? createProduct.status === 'pending'
//       : updateProduct.status === 'pending';

//   // Get subcategories for the selected category
//   const subcategories = categoriesData?.categories.find(cat => cat?._id === selectedCategory)?.subcategories || [];

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Product Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter product title" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="clothing">Clothing</SelectItem>
//                     <SelectItem value="accessories">Accessories</SelectItem>
//                     <SelectItem value="footwear">Footwear</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           /> */}
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value);
//                     setSelectedCategory(value);
//                     // Reset subcategory when category changes
//                     form.setValue('subcategory', '');
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {categoriesData?.categories.map((category) => {
//                       if (!category || typeof category._id !== 'string') return null;
//                       return (
//                         <SelectItem
//                           key={category._id}
//                           value={category._id}
//                         >
//                           {category.name}
//                         </SelectItem>
//                       );
//                     })}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Subcategory Select */}
//           <FormField
//             control={form.control}
//             name="subcategory"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Subcategory</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                   disabled={!selectedCategory}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select subcategory" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {subcategories.map((subcategory) => (
//                       <SelectItem
//                         key={subcategory._id.toString()}
//                         value={subcategory._id.toString()}
//                       >
//                         {subcategory.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//         </div>

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter product description" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="image"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Image URL</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter image URL" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-semibold">Sizes</h3>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 const sizes = form.getValues('sizes')
//                 form.setValue('sizes', [
//                   ...sizes,
//                   {
//                     name: '',
//                     stock: 0,
//                     price: 0
//                   }
//                 ])
//               }}
//             >
//               <Plus className="mr-2 h-4 w-4" /> Add Size
//             </Button>
//           </div>
//           {form.watch('sizes').map((_, index) => (
//             <div  key={form.getValues(`sizes.${index}._id`) || `size-${index}`} className="grid grid-cols-4 gap-2 mb-2">
//               <FormField
//                 control={form.control}
//                 name={`sizes.${index}.name`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input placeholder="Size" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`sizes.${index}.stock`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Stock"
//                         {...field}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name={`sizes.${index}.price`}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="Price"
//                         {...field}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {form.getValues('sizes').length > 1 && (
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="icon"
//                   onClick={() => {
//                     const sizes = form.getValues('sizes')
//                     form.setValue('sizes', sizes.filter((_, i) => i !== index))
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           ))}
//         </div>

//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
//             </>
//           ) : (
//             action === 'create' ? 'Create Product' : 'Update Product'
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default ProductDialog


'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Trash2, Plus, Loader2 } from 'lucide-react'
import { api } from '~/trpc/react'
import 'react-image-crop/dist/ReactCrop.css'
import ImageCropper from '../../global/imageCropper'
import { ICategory } from '~/server/db/category/category'
import { useSession } from 'next-auth/react'

// Enhanced Product Schema with Subcategory Validation
const createProductSchema = (categories: ICategory[] | undefined) => {
  return z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    images: z.array(z.string()).max(3, "Maximum 3 images allowed"),
    category: z.string().min(1, "Category is required"),
    subcategory: z.string().optional(),
    price: z.number()
      .positive("Price must be positive")
      .max(100000, "Price is too high")
      .optional(),
    stock: z.number()
      .int()
      .min(0, "Stock cannot be negative")
      .max(1000, "Maximum stock is 1000")
      .optional(),
    sizes: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string()
            .min(1, "Size name is required")
            .refine(
              value => /^[a-zA-Z0-9\s]+$/.test(value), 
              { message: "Size name can only contain letters, numbers, and spaces" }
            ),
          stock: z.number()
            .int()
            .min(0, "Stock cannot be negative")
            .max(1000, "Maximum stock is 1000"),
          price: z.number()
            .positive("Price must be positive")
            .max(100000, "Price is too high")
        })
      )
      .optional()
      .refine(
        (sizes) => !sizes || sizes.length === 0 || sizes.every(size => 
          size.name.trim() !== '' && 
          size.stock > 0 && 
          size.price > 0
        ), 
        { 
          message: "All size fields must be filled when sizes are added",
          path: ["sizes"]
        }
      )
  }).refine(
    (data) => {
      // Find the selected category with improved optional chaining
      const selectedCategory = categories?.find(cat => cat?._id === data.category);
      
      // Simplified validation for subcategory requirement
      return !selectedCategory?.subcategories?.length || 
             (data.subcategory !== undefined && data.subcategory.trim() !== '');
    },
    { 
      message: "Subcategory is required for this category",
      path: ["subcategory"]
    }
  ).refine(
    // Simplified price requirement check
    (data) => data.sizes?.length ? true : data.price !== undefined,
    { 
      message: "Price is required when no sizes are specified",
      path: ["price"]
    }
  );
};
interface ProductSize {
  _id?: string;
  name: string;
  stock: number;
  price: number;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
  };
  sizes: ProductSize[];
  price?: number;
  stock?: number;
  isDisabled?: boolean;
}

export const ProductDialog: React.FC<{
  action: 'create' | 'edit';
  initialData?: Product;
  onClose: () => void;
}> = ({
  action,
  initialData,
  onClose
}) => {
    const utils = api.useUtils();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [showSizes, setShowSizes] = useState<boolean>(false);

  const { data: session } = useSession();
  const companyId:string = session?.user?.companyId ?? '';


    // Create mutation
    const createProduct = api.product.createProduct.useMutation({
      onSuccess: async() => {
      await  utils.product.getProducts.refetch();
        onClose();
      },
      onError: (error) => {
        console.error(error);
        alert(error)
      }
    });

    // Edit mutation
    const updateProduct = api.product.updateProduct.useMutation({
      onSuccess: async() => {
       await utils.product.getProducts.refetch();
        onClose();
      },
      onError: (error) => {
        console.error(error);
      }
    });

    // GET categories
    const { data: categoriesData, isLoading: categoriesLoading } =
      api.product.getCategories.useQuery({
        companyId
      });

    // Dynamic schema based on categories
    const productSchema = React.useMemo(() => {
      return createProductSchema(categoriesData?.categories);
    }, [categoriesData?.categories]);

    const form = useForm<z.infer<typeof productSchema>>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        images: initialData?.images ?? [],
        category: initialData?.category?._id ?? '',
        subcategory: initialData?.subcategory?._id ?? '',
        price: initialData?.price ?? undefined,
        stock: initialData?.stock ?? undefined,
        sizes: initialData?.sizes?.length
          ? initialData.sizes.map((size) => ({
              _id: size._id,
              name: size.name,
              stock: size.stock,
              price: size.price
            }))
          : []
      }
    });
      
    // Get subcategories for the selected category
    const subcategories = categoriesData?.categories.find(cat => cat?._id === selectedCategory)?.subcategories ?? [];
      
    // Initialize images and category from initial data
    useEffect(() => {
      if (initialData?.images) {
        setImages(initialData.images);
      }
      if (initialData?.category?._id) {
        setSelectedCategory(initialData.category._id);
      }
      // Set initial sizes visibility
      setShowSizes((initialData?.sizes && initialData.sizes.length > 0) ?? false);
    }, [initialData]);
      
    useEffect(() => {
      if (selectedCategory) {
        const subcategoriesExist = subcategories.length > 0;
        // Dynamically set subcategory field validation
        form.setValue('subcategory', subcategoriesExist ? form.getValues('subcategory') : '');
      }
    }, [selectedCategory, subcategories]);

    const handleImageCropped = (croppedImage: string) => {
      if (images.length < 3) {
        setImages(prev => [...prev, croppedImage]);
        form.setValue('images', [...images, croppedImage]);
      }
    };

    const removeImage = (indexToRemove: number) => {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      setImages(updatedImages);
      form.setValue('images', updatedImages);
    };

    const sizes = form.watch('sizes') ?? [];

    const onSubmit = (data: z.infer<typeof productSchema>) => {

      console.log(data,"data---")
      const submitData = {
        ...data,
        category: data.category ?? initialData?.category?._id ?? '',
        companyId,
        // If sizes exist, remove standalone price
        ...(sizes.length > 0 ? { price: undefined } : {})
      };

      if (action === 'create') {
        createProduct.mutate(submitData);
      } else {
        updateProduct.mutate({
          ...submitData,
          productId: initialData?._id ?? ''
        });
      }
    };
    // Detect loading state
    const isLoading =
      action === 'create'
        ? createProduct.status === 'pending'
        : updateProduct.status === 'pending';

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 ">
          <div className='space-y-4 max-h-80 overflow-y-auto scrollbar-none p-2'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <div className={`grid ${subcategories.length > 0 ? 'grid-cols-2' : ''} gap-2`}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCategory(value);
                        // Reset subcategory when category changes
                        form.setValue('subcategory', '');
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesData?.categories.map((category) => {
                          if (!category || typeof category._id !== 'string') return null;
                          return (
                            <SelectItem
                              key={category._id}
                              value={category._id}
                            >
                              {category.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subcategory Select - Only render if subcategories exist */}
              {subcategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subcategory 
                        <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory._id.toString()}
                              value={subcategory._id.toString()}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Image Upload Section */}
            <div>
              <FormLabel>Product Images (Max 3)</FormLabel>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 m-1"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {images.length < 3 && (
                  <ImageCropper 
                  onImageCropped={handleImageCropped} 
                  aspectRatio={1}  // Square crop
                  minDimension={150}
                />
                )}
              </div>
            </div>

            {/* Standalone Price Field - Only show when no sizes */}
            {sizes.length === 0 && (
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                      <Input
                  type="number"
                  placeholder="Enter product price"
                  {...field}
                  value={field.value ?? ''} // Add this line
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>stock</FormLabel>
                      <FormControl>
                      <Input
                  type="number"
                  placeholder="Enter product stock"
                  {...field}
                  value={field.value ?? ''} // Add this line
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Sizes <span className='text-xs tracking-wide'>(Optional)</span></h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={sizes.length >= 6}
                  onClick={() => {
                    const sizes = form.getValues('sizes') ?? [];
                    if (sizes.length < 6) {
                      form.setValue('sizes', [...sizes, { name: '', stock: 0, price: 0 }]);
                      setShowSizes(true);
                    }
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Size
                </Button>
              </div>
              {sizes.length > 0 &&
                sizes.map((_, index) => (
                  <div
                    key={form.getValues(`sizes.${index}._id`) ?? `size-${index}`}
                    className="grid grid-cols-4 gap-2 mb-2"
                  >
                    {/* Size Name */}
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Size" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Stock */}
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Stock"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Size Price */}
                    <FormField
                      control={form.control}
                      name={`sizes.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                          <Input
  type="number"
  placeholder="Price"
  {...field}
  value={field.value ?? ''} // Add this line
  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
/>
                              
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const sizes = form.getValues('sizes');
                          const updatedSizes = sizes?.filter((_, i) => i !== index);
                          form.setValue('sizes', updatedSizes);
                          // Hide size fields and reset price if all sizes are removed
                          if (updatedSizes?.length === 0) {
                            setShowSizes(false);
                            // Reset price to undefined or a default value
                            form.setValue('price', undefined);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                {/* Validation Message */}
                {!showSizes && (
                  <p className="text-sm text-yellow-500 mt-1">
                   {` Click "Add Size" to specify product sizes`}
                  </p>
                )}
              </div>
            </div>
  
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {`Processing...`}
                </>
              ) : (
                action === 'create' ? 'Create Product' : 'Update Product'
              )}
            </Button>
          </form>
        </Form>
      )
    }
  
  export default ProductDialog