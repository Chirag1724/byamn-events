import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { findHostByEmail } from '@/services/host.service';
import { comparePassword } from '@/lib/utils/hash';
import type { NextAuthConfig } from 'next-auth';

// Type Augmentation 
// next-auth v5 (beta): Session + User live in 'next-auth', JWT lives in '@auth/core/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      hostId: string;
      name: string;
      email: string;
    };
  }

  interface User {
    /** Overrides the optional DefaultUser.id to be required */
    id: string;
    name: string;
    email: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    hostId: string;
  }
}

// Config 

const config: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === 'string'
            ? credentials.email.trim().toLowerCase()
            : null;
        const password =
          typeof credentials?.password === 'string'
            ? credentials.password
            : null;

        if (!email || !password) return null;

        const host = await findHostByEmail(email);
        if (!host) return null;

        const storedPassword = host.get('password', null, { getters: false }) as string | null;
        if (!storedPassword) return null;

        const isValid = await comparePassword(password, storedPassword);
        if (!isValid) return null;

        return {
          id: (host._id as { toString(): string }).toString(),
          name: host.name as string,
          email: host.email as string,
        };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/host/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      // `user` is only present on first sign-in
      if (user?.id) {
        token.hostId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          hostId: token.hostId ?? '',
          name: token.name ?? '',
          email: token.email ?? '',
        },
      };
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
