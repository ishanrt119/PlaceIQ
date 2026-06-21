import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN';
      isVerified: boolean;
      isOnboarded: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN';
    isVerified: boolean;
    isOnboarded: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN';
    isVerified: boolean;
    isOnboarded: boolean;
  }
}
