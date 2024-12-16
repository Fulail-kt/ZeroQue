// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { env } from "../../env";


// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authConfig = {
//   providers: [
//     GoogleProvider({
//       clientId: env.AUTH_GOOGLE_ID ?? "",
//       clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
//     }),
//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the GOOGLE provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//   ],
//   callbacks: {
//     session: ({ session, token }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: token.sub,
//       },
//     }),
//   },
// } satisfies NextAuthConfig;

// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { env } from "../../env";
// import { CompanyModel as User, ICompany } from "../db/company/company";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import { compare } from "bcryptjs";
// import dbConnect from "../db";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";

// // Extend default session types
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       companyId?: string;
//       userRole?: string;
//       companyProfileId?: string;
//     } & DefaultSession["user"];
//   }
  
//   interface User {
//     _id: string;
//     companyId?: string;
//     userRole?: string;
//     companyProfileId?: string;
//   }
// }

// export const authConfig = {
//   providers: [
//     GoogleProvider({
//       clientId: env.AUTH_GOOGLE_ID ?? "",
//       clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.companyId = user.companyId;
//         token.email = user.email;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.companyId = token.companyId as string;
//         session.user.email = token.email as string;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
// } satisfies NextAuthConfig;

// // In your server component or route handler
// export async function getSession() {
//   const { auth } = await import("~/server/auth");
//   return await auth();
// }


// import GoogleProvider from "next-auth/providers/google";
// import { env } from "../../env";
// import { CompanyModel as User, ICompany } from "../db/company/company";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import dbConnect from "../db";

// // Extend default session types
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       companyId: string;
//       userRole?: string;
//       companyProfileId?: string;
//     } & DefaultSession["user"];
//   }
  
//   interface User {
//     _id: string;
//     companyId: string;
//     userRole?: string;
//     companyProfileId?: string;
//   }
// }

// export const authConfig = {
//   providers: [
//     GoogleProvider({
//       clientId: env.AUTH_GOOGLE_ID ?? "",
//       clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       // Ensure database connection
//       await dbConnect();

//       try {
//         // Check if user already exists
//         let existingUser = await User.findOne({ 
//           email: user.email,
//           $or: [
//             { googleId: account?.providerAccountId },
//             { email: user.email }
//           ]
//         });

//         // If user doesn't exist, create new user
//         if (!existingUser) {
//           // Prepare user data with optional fields
//           const userData: Partial<ICompany> = {
//             name: user.name || profile?.name || 'Google User',
//             email: user.email || profile?.email!,
//             profile: user.image || profile?.picture!,
//             googleId: account?.providerAccountId,
//             authProvider: 'google',
//             userRole: 'user', 
//           };

//           // Remove undefined values
//           Object.keys(userData).forEach(key => 
//             userData[key as keyof typeof userData] === undefined && 
//             delete userData[key as keyof typeof userData]
//           );

//           existingUser = new User(userData);

//           // Validate and save with try-catch to handle specific validation errors
//           try {
//             await existingUser.save();
//           } catch (validationError) {
//             console.error("Validation Error:", validationError);
            
//             // Log specific validation errors
//             if (validationError instanceof Error && 'errors' in validationError) {
//               const errors = (validationError as any).errors;
//               Object.keys(errors).forEach(key => {
//                 console.error(`${key}: ${errors[key].message}`);
//               });
//             }
            
//             // Optionally, you can modify the user data to meet validation requirements
//             throw new Error("User creation failed due to validation error");
//           }
//         } else {
//           // Update existing user with latest information
//           existingUser.name = user.name || existingUser.name;
//           existingUser.profile = user.image || existingUser.profile;
          
//           // Only update googleId if not already set
//           if (!existingUser.googleId) {
//             existingUser.googleId = account?.providerAccountId;
//             existingUser.authProvider = 'google';
//           }

//           await existingUser.save();
//         }

//         return true;
//       } catch (error) {
//         console.error("Google OAuth Sign In Error:", error);
        
//         // More detailed error logging
//         if (error instanceof Error) {
//           console.error("Error Name:", error.name);
//           console.error("Error Message:", error.message);
          
//           // If it's a mongoose validation error, log detailed validation errors
//           if (error.name === 'ValidationError') {
//             const validationError = error as any;
//             Object.keys(validationError.errors).forEach(key => {
//               console.error(`Validation Error for ${key}:`, validationError.errors[key].message);
//             });
//           }
//         }
        
//         return false;
//       }
//     },
//     async jwt({ token, user, account }) {
//       // If it's a new sign-in, add user details to the token
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.image = user.image;
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.email = token.email as string;
//         session.user.name = token.name as string;
//         session.user.image = token.image as string;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     error: '/auth/error', // Custom error page
//   },
// } satisfies NextAuthConfig;

// // In your server component or route handler
// export async function getSession() {
//   const { auth } = await import("~/server/auth");
//   return await auth();
// }



// import GoogleProvider from "next-auth/providers/google";
// import { env } from "../../env";
// import { CompanyModel as User, ICompany } from "../db/company/company";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import dbConnect from "../db";
// import { randomBytes } from "crypto";

// // Extend default session types
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       companyId: string;
//       userRole?: string;
//       companyProfileId?: string;
//     routeName:string;
//     } & DefaultSession["user"];
//   }
  
//   interface User {
//     _id: string;
//     companyId: string;
//     userRole?: string;
//     companyProfileId?: string;
//     routeName:string;
//   }
// }

// // Function to generate a unique route name
// async function generateUniqueRouteName(originalName: string): Promise<string> {
//   // Replace spaces with hyphens and convert to lowercase
//   let baseRouteName = originalName.toLowerCase().replace(/\s+/g, '-');
  
//   // Check if the route name already exists in any company
//   const existingRouteName = await User.findOne({ routeName: baseRouteName });
  
//   // If route name doesn't exist in any company, return the base route name
//   if (!existingRouteName) {
//     return baseRouteName;
//   }
  
//   // If route name exists, add a random number to make it unique
//   let uniqueRouteName = `${baseRouteName}-${randomBytes(2).toString('hex')}`;
  
//   // Ensure the new unique route name is also not taken
//   while (await User.findOne({ routeName: uniqueRouteName })) {
//     uniqueRouteName = `${baseRouteName}-${randomBytes(2).toString('hex')}`;
//   }
  
//   return uniqueRouteName;
// }


// export const authConfig = {
//   providers: [
//     GoogleProvider({
//       clientId: env.AUTH_GOOGLE_ID ?? "",
//       clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       // Ensure database connection
//       await dbConnect();

//       try {
//         // Check if user already exists
//         let existingUser = await User.findOne({ 
//           email: user.email,
//           $or: [
//             { googleId: account?.providerAccountId },
//             { email: user.email }
//           ]
//         });

//         // If user doesn't exist, create new user
//         if (!existingUser) {

//           const initialRouteName = (user.name || profile?.name || 'google-user')
//           .toLowerCase()
//           .replace(/\s+/g, '-');

//         // Generate a unique route name
//         const uniqueRouteName = await generateUniqueRouteName(initialRouteName);

//           // Prepare user data with optional fields
//           const userData: Partial<ICompany> = {
//             name: user.name || profile?.name || 'Google User',
//             email: user.email || profile?.email!,
//             profile: user.image || profile?.picture!,
//             googleId: account?.providerAccountId,
//             authProvider: 'google',
//             userRole: 'COMPANY', 
//             routeName:uniqueRouteName,
//             isVerified:profile?.email_verified ?? false
//           };

//           // Remove undefined values
//           Object.keys(userData).forEach(key => 
//             userData[key as keyof typeof userData] === undefined && 
//             delete userData[key as keyof typeof userData]
//           );

//           existingUser = new User(userData);

//           // Validate and save with try-catch to handle specific validation errors
//           try {
//             await existingUser.save();
//           } catch (validationError) {
//             console.error("Validation Error:", validationError);
            
//             // Log specific validation errors
//             if (validationError instanceof Error && 'errors' in validationError) {
//               const errors = (validationError as any).errors;
//               Object.keys(errors).forEach(key => {
//                 console.error(`${key}: ${errors[key].message}`);
//               });
//             }
            
//             // Optionally, you can modify the user data to meet validation requirements
//             throw new Error("User creation failed due to validation error");
//           }
//         } else {
//           // Update existing user with latest information
//           existingUser.name = user.name || existingUser.name;
//           existingUser.profile = user.image || existingUser.profile;
          
//           // Only update googleId if not already set
//           if (!existingUser.googleId) {
//             existingUser.googleId = account?.providerAccountId;
//             existingUser.authProvider = 'google';
//           }

//           await existingUser.save();
//         }

//         return true;
//       } catch (error) {
//         console.error("Google OAuth Sign In Error:", error);
        
//         // More detailed error logging
//         if (error instanceof Error) {
//           console.error("Error Name:", error.name);
//           console.error("Error Message:", error.message);
          
//           // If it's a mongoose validation error, log detailed validation errors
//           if (error.name === 'ValidationError') {
//             const validationError = error as any;
//             Object.keys(validationError.errors).forEach(key => {
//               console.error(`Validation Error for ${key}:`, validationError.errors[key].message);
//             });
//           }
//         }
        
//         return false;
//       }
//     },
//     async jwt({ token, user, account }) {
//       // If it's a new sign-in, add user details to the token
//       if (user) {
//         // Find the user in the database to get the companyId
//         const dbUser = await User.findOne({ 
//           email: user.email,
//           $or: [
//             { googleId: account?.providerAccountId },
//             { email: user.email }
//           ]
//         });

//         token.id = user.id || dbUser?._id;
//         token.companyId = dbUser?._id;
//         token.email = user.email;
//         token.name = user.name;
//         token.image = user.image;
//         token.userRole = dbUser?.userRole;
//         token.routeName = dbUser?.routeName; 
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.companyId = token.companyId as string;
//         session.user.routeName = token.routeName as string; 
//         session.user.email = token.email as string;
//         session.user.name = token.name as string;
//         session.user.image = token.image as string;
//         session.user.userRole = token.userRole as string;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     error: '/auth/error', // Custom error page
//   },
// } satisfies NextAuthConfig;

// // In your server component or route handler
// export async function getSession() {
//   const { auth } = await import("~/server/auth");
//   return await auth();
// }




// typescript
// File: src/server/auth.ts
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../env";
import { 
  type DefaultSession, 
  type NextAuthConfig, 
  type Account as NextAuthAccount, 
  type Profile as NextAuthProfile,
  type User as NextAuthUser
} from "next-auth";
import { JWT } from "next-auth/jwt";
import dbConnect from "../db";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// Import your Company/User model
import { CompanyModel as User, ICompany } from "../db/company/company";

// Extended session types with more specific interfaces
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      companyId: string;
      userRole: ICompany['userRole'];
      companyProfileId?: string;
      routeName: string;
    } & DefaultSession["user"];
  }
  
  interface User {
    _id?: string;
    companyId?: string;
    userRole?: ICompany['userRole'];
    companyProfileId?: string;
    routeName?: string;
  }
}

interface GoogleProfile extends NextAuthProfile {
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  sub: string;
}

// Extend the default JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    companyId: string;
    email: string;
    name?: string;
    image?: string;
    userRole?: ICompany['userRole'];
    routeName?: string;
  }
}

// Type-safe function to generate unique route name
async function generateUniqueRouteName(originalName: string): Promise<string> {
  // Sanitize the name for route generation
  let baseRouteName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  if (!baseRouteName) {
    baseRouteName = 'user';
  }
  
  const existingRouteName = await User.findOne({ routeName: baseRouteName });
  
  if (!existingRouteName) {
    return baseRouteName;
  }
  
  let uniqueRouteName: string;
  do {
    const randomSuffix = randomBytes(2).toString('hex');
    uniqueRouteName = `${baseRouteName}-${randomSuffix}`;
  } while (await User.findOne({ routeName: uniqueRouteName }));
  
  return uniqueRouteName;
}

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID ?? "",
      clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
      
      // Define profile to ensure type safety
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Ensure database connection
        await dbConnect();
      
        // Validate inputs
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        if (typeof credentials.password !== "string" || typeof credentials.email !== "string") {
          throw new Error("Invalid credentials format");
        }
      
        // Find the user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with the provided email");
        }

        if(!user.password ){
          throw new Error("No password found for the user");
        }
      
        // Verify the password
        const isPasswordValid = await bcrypt.compare(credentials?.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
      
        // Add additional fields to the user object if needed
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          userRole: user.userRole,
          routeName: user.routeName,
        };
      }
      
    })
  ],
  callbacks: {
    async signIn({ 
      user, 
      account, 
      profile 
    }: { 
      user: NextAuthUser; 
  account: NextAuthAccount | null; 
  profile?: NextAuthProfile 
    }) {
      // Ensure database connection
      await dbConnect();

      try {
        // Robust type checking for Google OAuth
        if (account?.provider === 'google') {
          if (!account || !profile) {
            console.error("Missing account or profile information");
            return false;
          }

          // Find existing user with robust matching
          let existingUser = await User.findOne({ 
            $or: [
              { googleId: account.providerAccountId },
              { email: user.email }
            ]
          });

          // If user doesn't exist, create new user
          if (!existingUser) {
            // Generate unique route name
            const initialRouteName = (user.name || profile.name || 'google-user');
            const uniqueRouteName = await generateUniqueRouteName(initialRouteName);

            // Prepare user data with strict typing
            const userData: Partial<ICompany> = {
              name: user.name || profile.name || 'Google User',
              email: user.email! || profile.email!,
              profile: user.image || profile.picture,
              googleId: account.providerAccountId,
              authProvider: 'google',
              userRole: 'COMPANY', 
              routeName: uniqueRouteName,
              isVerified: profile.email_verified ?? false
            };

            // Remove any undefined values
            Object.keys(userData).forEach(key => 
              userData[key as keyof typeof userData] === undefined && 
              delete userData[key as keyof typeof userData]
            );

            // Create and save new user with error handling
            existingUser = new User(userData);

            try {
              await existingUser.save();
            } catch (validationError) {
              console.error("User Creation Validation Error:", validationError);
              throw new Error("Failed to create user account");
            }
          } else {
            // Update existing user with latest information
            existingUser.name = user.name || existingUser.name;
            existingUser.profile = user.image || existingUser.profile;
            
            // Only update googleId if not already set
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
              existingUser.authProvider = 'google';
            }

            // Update verification status if it changed
            existingUser.isVerified = existingUser.isVerified || 
              (profile.email_verified ?? false);

            await existingUser.save();
          }
        }

        return true;
      } catch (error) {
        console.error("Sign In Error:", error);
        return false;
      }
    },
    
    async jwt({ 
      token, 
      user, 
      account 
    }: { 
      token: JWT; 
      user?: NextAuthUser; 
      account?: NextAuthAccount | null 
    }) {
      // If it's a new sign-in, add user details to the token
      if (user && account) {
        // Find the user in the database to get the most up-to-date information
        const dbUser = await User.findOne({ 
          $or: [
            { googleId: account.providerAccountId },
            { email: user.email }
          ]
        });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.companyId = dbUser._id.toString();
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.image = dbUser.profile;
          token.userRole = dbUser.userRole;
          token.routeName = dbUser.routeName;
        }
      }

      return token;
    },
    
    async session({ 
      session, 
      token 
    }: { 
      session: DefaultSession; 
      token: JWT 
    }) {
      // Populate session with token information
      if (session.user) {
        session.user.id = token.id;
        session.user.companyId = token.companyId;
        session.user.routeName = token.routeName;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.userRole = token.userRole;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    error: '/auth/error', // Custom error page for authentication failures
  },
} satisfies NextAuthConfig;

// Utility function to get the current session
export async function getSession() {
  const { auth } = await import("~/server/auth");
  return await auth();
}