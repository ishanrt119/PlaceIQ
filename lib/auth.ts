/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/database';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid email or password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          name: user.fullName, 
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isOnboarded: user.isOnboarded,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email || !user.name) {
          return false;
        }
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
            fullName: user.name,
            profilePicture: user.image || '',
            role: 'STUDENT',
            isVerified: true, // Google accounts are implicitly verified
            isOnboarded: false,
          });
          user.id = newUser._id.toString();
          (user as any).role = newUser.role;
          (user as any).isVerified = newUser.isVerified;
          (user as any).isOnboarded = newUser.isOnboarded;
        } else {
          user.id = existingUser._id.toString();
          (user as any).role = existingUser.role;
          (user as any).isVerified = existingUser.isVerified;
          (user as any).isOnboarded = existingUser.isOnboarded;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'STUDENT';
        token.isVerified = (user as any).isVerified || false;
        token.isOnboarded = (user as any).isOnboarded || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN';
        (session.user as any).isVerified = token.isVerified as boolean;
        (session.user as any).isOnboarded = token.isOnboarded as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
