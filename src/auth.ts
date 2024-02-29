import NextAuth from 'next-auth';
import type { AdapterUser } from '@auth/core/adapters';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import authConfig from '@/auth.config';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { getTwoFactorConfirmationByUserId } from '@/db/queries/two-factor-confirmation';
import { twoFactorConfirmations } from '@/db/schemas';
import { ERoles } from '@/db/types';
import { getUserById } from '@/db/queries/user';
import { getAccountByUserId } from '@/db/queries/account';
import { ExtendUser } from './next-auth';

export const {
  auth,
  signIn,
  signOut,
  handlers: { POST, GET },
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const adapterUser: AdapterUser = user as AdapterUser;

      // prevent signIn without email verification
      if (!adapterUser?.emailVerified) {
        return false;
      }

      // @ts-expect-error - isTwoFactorEnabled is available
      if (adapterUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          adapterUser.id
        );

        if (!twoFactorConfirmation) return false;

        const hasExpired =
          new Date(twoFactorConfirmation.expires).getTime() < Date.now();

        if (hasExpired) return false;

        await db
          .delete(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.id, twoFactorConfirmation.id));
      }

      return true;
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }

      if (session?.user && token?.role) {
        session.user.role = token.role as ERoles;
      }

      if (session?.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      session.user = {
        ...session.user,
        ...token,
      } as AdapterUser & ExtendUser;

      return session;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      return {
        ...token,
        ...existingUser,
        isOAuth: !!(await getAccountByUserId(existingUser.id)),
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  adapter: DrizzleAdapter(db),
  ...authConfig,
});
