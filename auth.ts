import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { LoginLog, connectDb } from '@/lib/db';
import { formatInIST, formatInET } from '@/lib/date-timezones';
import { getUserByEmail } from '@/lib/get-user-by-email';
import { shouldSendLoginSuccessEmail, sendLoginSuccessEmail } from '@/lib/email';
import type { Role } from '@/lib/constants';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const user = await getUserByEmail(email);
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email ?? '';
        session.user.name = token.name ?? null;
        session.user.role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user?.id) return;
      try {
        await connectDb();
        const loggedAt = new Date();
        const userId = mongoose.Types.ObjectId.isValid(user.id)
          ? new mongoose.Types.ObjectId(user.id)
          : null;
        if (userId) {
          await LoginLog.create({
            userId,
            loggedAt,
            loggedAtIST: formatInIST(loggedAt),
            loggedAtET: formatInET(loggedAt),
          });
        }
      } catch (err) {
        console.error('LoginLog create failed (login still succeeded):', err);
      }
      if (user?.email && user?.role && shouldSendLoginSuccessEmail(user.role)) {
        sendLoginSuccessEmail(user.email, user.name ?? null, user.role).catch((err) =>
          console.error('Login success email failed:', err)
        );
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.AUTH_SECRET,
});
