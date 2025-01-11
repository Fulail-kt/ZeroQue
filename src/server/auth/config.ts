
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
      onBoarding: boolean; 
    } & DefaultSession["user"];
  }

  
  
  interface User {
    _id?: string;
    companyId?: string;
    userRole?: ICompany['userRole'];
    companyProfileId?: string;
    routeName?: string;
    onBoarding:boolean;
  }
}

interface SessionWithUser extends DefaultSession {
  user: {
    id: string;
    companyId: string;
    userRole: ICompany['userRole'];
    routeName: string;
    onBoarding: boolean;
    email: string;
    name?: string;
    image?: string;
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
    onBoarding:boolean;
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
          image: profile.picture,
          onBoarding: false 
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
          onBoarding: user.onBoarding 
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
            const initialRouteName = (user.name ?? profile.name ?? 'google-user');
            const uniqueRouteName = await generateUniqueRouteName(initialRouteName);

            const profileImage = typeof user.image === 'string' 
            ? user.image 
            : typeof profile?.picture === 'string' 
              ? profile.picture 
              : '';

            // Prepare user data with strict typing
            const userData: Partial<ICompany> = {
              name: user.name ?? profile.name ?? 'Google User',
              email: user.email! ?? profile.email!,
              profile: profileImage,
              googleId: account.providerAccountId,
              authProvider: 'google',
              userRole: 'COMPANY', 
              routeName: uniqueRouteName,
              isVerified: profile.email_verified ?? false,
              onBoarding: false 
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
            existingUser.name = user.name ?? existingUser.name;
            existingUser.profile = user.image ?? existingUser.profile;
            
            // Only update googleId if not already set
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
              existingUser.authProvider = 'google';
            }

            // Update verification status if it changed
            existingUser.isVerified = existingUser.isVerified ?? 
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
      account,
      trigger,
      session,
    }: { 
      token: JWT; 
      user?: NextAuthUser; 
      account?: NextAuthAccount | null ,
      trigger?: "signIn" | "signUp" | "update";
      session?: SessionWithUser;
    }) {

      if (trigger === "update" && session?.user) {
        return {...token, ...session.user}
      }
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
          token.onBoarding=dbUser.onBoarding;
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
        session.user.onBoarding=token.onBoarding;
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