'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';

// Form schema definition remains the same
const formSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  name: z.string()
    .min(1, "Business name is required")
    .min(2, "Business name must be at least 2 characters"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  routeName: z.string()
    .min(1, "Route name is required")
    .min(2, "Route name must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Route name can only contain lowercase letters, numbers, and hyphens")
    .refine((value) => !value.startsWith('-') && !value.endsWith('-'), 
      "Route name cannot start or end with a hyphen"),
  address: z.string()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters"),
  upiId: z.string()
    .min(1, "UPI ID is required")
    .min(5, "UPI ID must be at least 5 characters")
});

type FormValues = z.infer<typeof formSchema>;

const OnboardingModal = () => {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [debouncedRouteName, setDebouncedRouteName] = React.useState("");
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      routeName: "",
      address: "",
      upiId: ""
    },
    mode: "onBlur",
  });

  const { data: routeCheckData, isLoading: isCheckingRoute } = api.company.checkRoute.useQuery(
    { 
      slug: debouncedRouteName,
      currentCompanyId: session?.user?.companyId 
    },
    {
      enabled: debouncedRouteName.length >= 2,
    }
  );

  const { data: companyData, isLoading: isLoadingCompany } = api.company.getCompanyById.useQuery({
    companyId: session?.user?.companyId ?? "",
  }, {
    enabled: !!session?.user?.companyId,
  });

  useEffect(() => {
    if (companyData) {
      form.reset({
        email: companyData.email,
        name: companyData.name,
        phone: companyData.phone?.toString() ?? "",
        routeName: companyData.routeName,
        address: "",
        upiId: companyData.upiId ?? ""
      });
    }
  }, [companyData, form]);

  useEffect(() => {
    if (routeCheckData?.exists) {
      form.setError('routeName', {
        type: 'manual',
        message: 'This route name is already taken'
      });
    } else {
      form.clearErrors('routeName');
    }
  }, [routeCheckData, form]);

  useEffect(() => {
    const routeName = form.watch('routeName');
    const timer = setTimeout(() => {
      if (routeName && routeName.length >= 2 && /^[a-z0-9-]+$/.test(routeName)) {
        setDebouncedRouteName(routeName);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.watch('routeName')]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'routeName' && value.routeName) {
        const formattedRoute = value.routeName
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        if (formattedRoute !== value.routeName) {
          form.setValue('routeName', formattedRoute);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const updateCompany = api.company.updateOnboarding.useMutation({
    onSuccess: async (updatedCompany) => {
      if (session) {
        await updateSession({
          ...session,
          user: {
            ...session.user,
            onBoarding: true,
          }
        });
      }
      router.refresh();
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (routeCheckData?.exists) {
      form.setError('routeName', {
        type: 'manual',
        message: 'This route name is already taken'
      });
      return;
    }

    await updateCompany.mutateAsync({
      ...data,
      phone: parseInt(data.phone),
      onBoarding: true,
    });
  };

  // Show loading state only on initial load
  if (isLoadingCompany && isInitialLoad) {
    return (
      <Dialog open={true}>
        <DialogContent className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true}>
    <DialogContent 
      className="sm:max-w-[800px] mx-4 md:mx-auto max-h-[90vh] overflow-hidden flex flex-col"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogHeader className="flex-shrink-0">
        <DialogTitle className="text-2xl font-bold">Complete Your Profile</DialogTitle>
        <DialogDescription className="text-base mt-2">
          Please complete your business profile to continue using the platform.
        </DialogDescription>
      </DialogHeader>
      
      <div className="overflow-y-auto flex-grow px-1 py-4 custom-scrollbar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled 
                        placeholder="your@email.com"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your business name"
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        placeholder="Enter your phone number"
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="routeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Route Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          placeholder="enter-route-name"
                          className="focus:ring-2 focus:ring-primary"
                        />
                        {isCheckingRoute && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your address"
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">UPI ID</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter your UPI ID"
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

</div>

<p className="text-[12px] font-serif italic text-center text-gray-500">
  Note: Use lowercase letters, numbers, and hyphens only. Example: my-business-name
</p>

<div className="sticky ">
  <Button 
    type="submit" 
    className="w-full py-6 text-lg font-medium bg-primary hover:bg-primary/90 transition-colors"
    disabled={updateCompany.isPending || isCheckingRoute}
  >
    {updateCompany.isPending ? (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Saving...</span>
      </div>
    ) : (
      'Complete Onboarding'
    )}
  </Button>
</div>
</form>
</Form>
</div>
</DialogContent>
</Dialog>
);
};

export default OnboardingModal;