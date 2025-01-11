// 'use client'
// import React, { useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input";
// import { Label } from "~/components/ui/label";
// import { signIn } from "next-auth/react";
// import { Eye, EyeOff, Fingerprint } from "lucide-react";
// import { api } from "~/trpc/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// // Improved Zod Schema with more specific validations
// const signupSchema = z.object({
//   name: z.string()
//     .min(2, { message: "Name must be at least 2 characters long" })
//     .max(50, { message: "Name cannot exceed 50 characters" })
//     .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  
//   email: z.string()
//     .email({ message: "Invalid email address format" })
//     .max(100, { message: "Email address is too long" }),
  
//   password: z.string()
//     .min(8, { message: "Password must be at least 8 characters" })
//     .max(32, { message: "Password cannot exceed 32 characters" })
//     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
//       message: "Password must include uppercase, lowercase, and number" 
//     }),
  
//   phoneNumber: z.string()
//     .regex(/^\+?[\d\s-]{10,15}$/, { message: "Invalid phone number format" }),
// });

// // Type inference for the signup schema
// type SignupFormData = z.infer<typeof signupSchema>;

// const SignupPage: React.FC = () => {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const router=useRouter()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//     mode: 'onChange', 
//   });

//   const createAccount = api.company.createAccount.useMutation({
//     onSuccess: () => {
//       console.log('Account created successfully!');
//       router.push('/auth/login');
//     },
//     onError: (error) => {
//       console.error('Account creation failed:', error);
//     },
//   });

//   const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
//     try {
//       console.log("Signup Data: ", data);
//       await createAccount.mutateAsync(data);
//     } catch (error) {
//       console.error("Signup error:", error);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(prev => !prev);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <div className="text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//               Create a new account
//             </h2>
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//               Or{' '}
//               <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
//               Sign in to your account
//               </Link>
//             </p>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Name Input */}
//             <div>
//               <Label 
//                 htmlFor="name" 
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Name
//               </Label>
//               <div className="mt-1 relative">
//                 <Input
//                   id="name"
//                   type="text"
//                   {...register("name")}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
//                     dark:text-white transition-colors duration-200"
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email Input */}
//             <div>
//               <Label 
//                 htmlFor="email" 
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Email address
//               </Label>
//               <div className="mt-1 relative">
//                 <Input
//                   id="email"
//                   type="email"
//                   {...register("email")}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
//                     dark:text-white transition-colors duration-200"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <Label 
//                 htmlFor="password" 
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Password
//               </Label>
//               <div className="mt-1 relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   {...register("password")}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
//                     dark:text-white transition-colors duration-200 pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Phone Number Input */}
//             <div>
//               <Label 
//                 htmlFor="phoneNumber" 
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Phone Number
//               </Label>
//               <div className="mt-1 relative">
//                 <Input
//                   id="phoneNumber"
//                   type="tel"
//                   {...register("phoneNumber")}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 
//                     dark:text-white transition-colors duration-200"
//                 />
//                 {errors.phoneNumber && (
//                   <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                     {errors.phoneNumber.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Submit and Google Signup Buttons */}
//             <div className="space-y-4">
//               <Button 
//                 type="submit" 
//                 disabled={isSubmitting}
//                 className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 
//                   text-white font-semibold rounded-md shadow-md transition-colors duration-200 
//                   disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Signing up...' : 'Sign up'}
//               </Button>

//               <div className="relative flex items-center justify-center">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
//                 </div>
//                 <div className="relative px-4 text-center">
//                   <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <Button
//   type="button"
//   onClick={async () => {
//     try {
//       await signIn("google");
//       router.push('/');
//     } catch (error) {
//       console.error("Google sign-in failed:", error);
//     }
//   }}
//   className="w-full py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white 
//     border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 
//     rounded-md shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
// >
//   <Fingerprint className="h-5 w-5" />
//   Sign up with Google
// </Button>

//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;
// // 'use client'
// // import React, { useState } from 'react';
// // import Link from 'next/link';
// // import { useForm, SubmitHandler } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import * as z from 'zod';
// // import { Button } from '~/components/ui/button';
// // import { Input } from '~/components/ui/input';
// // import { Label } from '~/components/ui/label';
// // import { Eye, EyeOff, Fingerprint } from 'lucide-react';
// // import { api } from '~/trpc/react';
// // import { signIn } from "next-auth/react";
// // import { motion } from 'framer-motion';

// // // Zod schema for form validation
// // const signupSchema = z.object({
// //   name: z.string()
// //     .min(2, { message: 'Name must be at least 2 characters long' })
// //     .max(50, { message: 'Name cannot exceed 50 characters' })
// //     .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
// //   email: z.string()
// //     .email({ message: 'Invalid email address format' })
// //     .max(100, { message: 'Email address is too long' }),
// //   password: z.string()
// //     .min(8, { message: 'Password must be at least 8 characters' })
// //     .max(32, { message: 'Password cannot exceed 32 characters' })
// //     .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
// //       message: 'Password must include uppercase, lowercase, and number',
// //     }),
// //   phoneNumber: z.string()
// //     .regex(/^\+?[\d\s-]{10,15}$/, { message: 'Invalid phone number format' }),
// // });

// // type SignupFormData = z.infer<typeof signupSchema>;

// // const SignupPage: React.FC = () => {
// //   const [showPassword, setShowPassword] = useState<boolean>(false);

// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors, isSubmitting },
// //   } = useForm<SignupFormData>({
// //     resolver: zodResolver(signupSchema),
// //     mode: 'onChange',
// //   });

// //   const createAccount = api.company.createAccount.useMutation();

// //   const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
// //     try {
// //       console.log('Signup Data: ', data);
// //       await createAccount.mutateAsync(data);
// //     } catch (error) {
// //       console.error('Signup error:', error);
// //     }
// //   };

// //   const togglePasswordVisibility = () => {
// //     setShowPassword((prev) => !prev);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
// //       {/* Navigation Header */}
// //       <nav className="">
// //         <div className="max-w-7xl ">
// //           <div className="flex justify-between h-10">
// //             <div className="flex mt-2 px-4 items-center">
// //               {/* Logo */}
// //               <Link href="/" className="flex-shrink-0 flex items-center">
// //                 <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
// //                   Logo
// //                 </span>
// //               </Link>
              
// //               {/* Home Link */}
// //               <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
// //                 <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
// //                   Home
// //                 </Link>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </nav>

// //       {/* Signup Form */}
// //       <div className="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
// //         <motion.div
// //           className="w-full max-w-md space-y-6"
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //         >
// //           <div className="text-center">
// //             <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
// //               Create a new account
// //             </h2>
// //             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
// //               Or{' '}
// //               <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
// //                 already have an account? Log in
// //               </Link>
// //             </p>
// //           </div>

// //           <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
// //             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// //               {/* Name Input */}
// //               <div>
// //                 <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                   Name
// //                 </Label>
// //                 <div className="mt-1 relative">
// //                   <Input
// //                     id="name"
// //                     type="text"
// //                     {...register('name')}
// //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
// //                   />
// //                   {errors.name && (
// //                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Email Input */}
// //               <div>
// //                 <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                   Email address
// //                 </Label>
// //                 <div className="mt-1 relative">
// //                   <Input
// //                     id="email"
// //                     type="email"
// //                     {...register('email')}
// //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
// //                   />
// //                   {errors.email && (
// //                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Password Input */}
// //               <div>
// //                 <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                   Password
// //                 </Label>
// //                 <div className="mt-1 relative flex justify-center flex-col">
// //                   <Input
// //                     id="password"
// //                     type={showPassword ? 'text' : 'password'}
// //                     {...register('password')}
// //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 pr-10"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={togglePasswordVisibility}
// //                     className={`absolute  right-0 pr-3 flex items-center ${errors.password?"-mt-6":"inset-y-0"} text-gray-400 hover:text-gray-600 dark:hover:text-gray-200`}
// //                   >
// //                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
// //                   </button>
// //                   {errors.password && (
// //                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Phone Number Input */}
// //               <div>
// //                 <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //                   Phone Number
// //                 </Label>
// //                 <div className="mt-1 relative">
// //                   <Input
// //                     id="phoneNumber"
// //                     type="tel"
// //                     {...register('phoneNumber')}
// //                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
// //                   />
// //                   {errors.phoneNumber && (
// //                     <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Submit and Google Signup Buttons */}
// //               <div className="space-y-4">
// //                 <Button
// //                   type="submit"
// //                   disabled={isSubmitting}
// //                   className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   {isSubmitting ? 'Signing up...' : 'Sign up'}
// //                 </Button>

// //                 <div className="relative flex items-center justify-center">
// //                   <div className="absolute inset-0 flex items-center">
// //                     <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
// //                   </div>
// //                   <div className="relative px-4 text-center">
// //                     <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">
// //                       Or continue with
// //                     </span>
// //                   </div>
// //                 </div>

// //                 <Button
// //                   type="button"
// //                   onClick={() => signIn('google')}
// //                   className="w-full py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
// //                 >
// //                   <Fingerprint className="h-5 w-5" />
// //                   Sign up with Google
// //                 </Button>
// //               </div>
// //             </form>
// //           </div>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SignupPage;


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Eye, EyeOff, Fingerprint, Loader2 } from 'lucide-react';
import { api } from '~/trpc/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { toast } from 'sonner';


const signupSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
  email: z.string()
    .email({ message: 'Invalid email address format' })
    .max(100, { message: 'Email address is too long' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password cannot exceed 32 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must include uppercase, lowercase, and number',
    }),
  phoneNumber: z.string()
    .regex(/^\+?[\d\s-]{10,15}$/, { message: 'Invalid phone number format' }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const createAccount = api.company.createAccount.useMutation({
    onSuccess: () => {
      toast('Account created successfully!',{
        description: 'Redirecting to login page...',
      });
      reset();
      router.push('/auth/login');
    },
    onError: (error) => {
      setError(error.message);
      toast.error('Error creating account',{
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      await createAccount.mutateAsync(data);
    } catch (error) {
      setError('Failed to create account. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      const result = await signIn('google', { redirect: false });
      
      if (result?.error) {
        setError('Failed to sign in with Google. Please try again.');
        toast.error('Google Sign-in Failed',{
          description: 'Please try again or use email signup.',
        });
      } else {
        router.push('/co/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b fixed w-full border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold text-primary">Logo</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md mt-8 space-y-2">
          <div className="text-center space-y-2">
            <h1 className="text-3xl  font-bold">Create your account</h1>
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="+1234567890"
                  className="w-full"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Sign up with Google
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;