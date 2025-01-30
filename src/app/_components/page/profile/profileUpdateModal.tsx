'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "~/lib/utils";
import { Loader2 } from 'lucide-react';

// Define validation schema
const updateFormSchema = z.object({
  routeName: z.string()
    .min(1, "Route name is required")
    .min(2, "Route name must be at least 2 characters")
    .max(50, "Route name must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, {
      message: "Route name can only contain lowercase letters, numbers, and hyphens"
    })
    .refine(
      (value) => !value.startsWith('-') && !value.endsWith('-'), 
      "Route name cannot start or end with a hyphen"
    )
    .refine(
      (value) => !value.includes('--'),
      "Route name cannot contain consecutive hyphens"
    ),
  upiId: z.string()
    .min(1, "UPI ID is required")
    .min(5, "UPI ID must be at least 5 characters")
    .max(50, "UPI ID must be less than 50 characters")
    .regex(/^[a-zA-Z0-9.\-_@]+$/, {
      message: "UPI ID can only contain letters, numbers, and special characters (. - _ @)"
    })
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    routeName: string;
    upiId: string;
  };
  onUpdate: (data: UpdateFormValues) => Promise<void>;
  isCheckingRoute: boolean;
  isRouteNameTaken: boolean;
}


const UpdateProfileModal = ({
  isOpen,
  onClose,
  initialData,
  onUpdate,
  isCheckingRoute,
  isRouteNameTaken
}: UpdateProfileModalProps) => {
  const [hasFormChanged, setHasFormChanged] = useState(false);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: initialData,
  });

  // Reset form when modal opens with initial data
  useEffect(() => {
    if (isOpen) {
      form.reset(initialData);
      setHasFormChanged(false);
    }
  }, [isOpen, initialData, form]);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isRouteNameChanged = value.routeName !== initialData.routeName;
      const isUpiIdChanged = value.upiId !== initialData.upiId;
      setHasFormChanged(isRouteNameChanged || isUpiIdChanged);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, initialData]);

  // Add route name taken validation
  useEffect(() => {
    if (isRouteNameTaken && form.getValues('routeName') !== initialData.routeName) {
      form.setError('routeName', {
        type: 'manual',
        message: 'This route name is already taken'
      });
    }
  }, [isRouteNameTaken, form, initialData.routeName]);

  const handleSubmit = async (data: UpdateFormValues) => {
    if (!hasFormChanged) return;
    await onUpdate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your business route name and UPI ID.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="routeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        placeholder="enter-route-name"
                        className={cn(
                          "font-mono",
                          hasFormChanged && field.value !== initialData.routeName && 
                          "border-blue-500 focus-visible:ring-blue-500"
                        )}
                      />
                      {isCheckingRoute && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be your unique URL: QEND.vercel.app/{field.value}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your UPI ID"
                      className={cn(
                        hasFormChanged && field.value !== initialData.upiId && 
                        "border-blue-500 focus-visible:ring-blue-500"
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your UPI ID to receive payments (e.g., name@bank)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !hasFormChanged || 
                  isCheckingRoute ||
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  (isRouteNameTaken && form.getValues('routeName') !== initialData.routeName)
                }
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal