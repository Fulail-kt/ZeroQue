// import Link from "next/link";

// import { LatestPost } from "~/app/_components/post";
// import { api, HydrateClient } from "~/trpc/server";
// import { auth } from "~/server/auth";

// export default async function Home() {
//   const session = await auth();

//   if (session?.user) {
//     void api.post.getLatest.prefetch();
//   }

//   return (
//     <HydrateClient>
//       <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//         <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
//           <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//             Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
//           </h1>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
//               href="https://create.t3.gg/en/usage/first-steps"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">First Steps →</h3>
//               <div className="text-lg">
//                 Just the basics - Everything you need to know to set up your
//                 database and authentication.
//               </div>
//             </Link>
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
//               href="https://create.t3.gg/en/introduction"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">Documentation →</h3>
//               <div className="text-lg">
//                 Learn more about Create T3 App, the libraries it uses, and how
//                 to deploy it.
//               </div>
//             </Link>
//           </div>
//           <div className="flex flex-col items-center gap-2">

//             <div className="flex flex-col items-center justify-center gap-4">
//               <p className="text-center text-2xl text-white">
//                 {session && <span>Logged in as {session.user?.name}</span>}
//               </p>
//               <Link
//                 href={session ? "/api/auth/signout" : "/api/auth/signin"}
//                 className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
//               >
//                 {session ? "Sign out" : "Sign in"}
//               </Link>
//             </div>
//           </div>

//           {session?.user && <LatestPost />}
//         </div>
//       </main>
//     </HydrateClient>
//   );
// }
'use client';

import React from "react";
import Link from 'next/link';
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import Loading from "~/app/_components/global/loading";

// Define the login schema with Zod for type-safe validation
const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Invalid email address format' })
    .max(100, { message: 'Email address is too long' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password cannot exceed 32 characters' }),
});

// Infer the type from the Zod schema
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirection logic in useEffect
  useEffect(() => {
    if (status !== "loading" && session) {
      const routeName = session.user?.routeName || 'default';
      router.push(`/co/${routeName}/dashboard`);
    }
  }, [session, status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        console.error("Login error:", result.error);
        return;
      } else {
        const sessionData = await getSession();

        if (sessionData?.user?.routeName) {
          router.push(`/co/${sessionData.user.routeName}/dashboard`);
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Render logic
  if (status === "loading") {
    return <Loading />;
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="">
        <div className="max-w-7xl">
          <div className="flex justify-between h-10">
            <div className="flex mt-2 px-4 items-center">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Logo
                </span>
              </Link>

              {/* Home Link */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                create a new account
              </Link>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Submit and Google Signin Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-md shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default behavior
                    if (isSubmitting) return; // Avoid double submissions
                  }}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>


                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
                  </div>
                  <div className="relative px-4 text-center">
                    <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => signIn('google')}
                  className="w-full py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md shadow-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Fingerprint className="h-5 w-5" />
                  Sign in with Google
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}