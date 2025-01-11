'use client';
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { api } from '~/trpc/react';
import { useSession } from 'next-auth/react';

// Zod schema for category validation
const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  subcategories: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z.string().min(1, "Subcategory name is required"),
        description: z.string().optional(),
      })
    )
    .optional(),
});

interface CategoryDialogProps {
  action: 'create' | 'edit';
  initialData?: z.infer<typeof categorySchema> & { _id?: string };
  onClose: () => void;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({ 
  action, 
  initialData, 
  onClose 
}) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const companyId:string = session?.user?.companyId ?? '';

  
  // Create mutation
  const createCategory = api.product.createCategory.useMutation({
    onSuccess: async () => {
      await utils.product.getCategories.refetch();
      onClose();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // Edit mutation
  const updateCategory = api.product.updateCategory.useMutation({
    onSuccess: async () => {
     await utils.product.getCategories.refetch({ companyId });
      onClose();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      subcategories: initialData?.subcategories ?? [],
    },
  });

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    if (action === 'create') {
      createCategory.mutate({ ...data, companyId });
    } else {
      updateCategory.mutate({ 
        ...data, 
        _id: initialData?._id ?? "",
      });
    }
  };

  // Detect loading state
  const isLoading = 
    action === 'create' 
      ? createCategory.status === 'pending' 
      : updateCategory.status === 'pending';

  const subcategories = form.watch('subcategories') ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className='space-y-4 max-h-80 overflow-y-auto scrollbar-none p-2'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className='text-xs tracking-wide'>(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Subcategories <span className='text-xs tracking-wide'>(Optional)</span></h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={subcategories.length >= 8}
                  onClick={() => {
                    if (subcategories.length < 8) {
                      form.setValue('subcategories', [
                        ...subcategories,
                        { name: '', description: '' },
                      ]);
                    }
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Subcategory
                </Button>
              </div>
              {subcategories.length > 0 && subcategories.map((_, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`subcategories.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Subcategory Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subcategories.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Subcategory Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const updatedSubcategories = subcategories.filter((_, i) => i !== index);
                      form.setValue('subcategories', updatedSubcategories);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {subcategories.length === 1 && (
              <p className="text-yellow-500 text-sm">Add at least one subcategory or click delete to leave empty.</p>
            )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            action === 'create' ? 'Create Category' : 'Update Category'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryDialog;
