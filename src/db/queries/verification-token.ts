'use server';

import { db } from '@/db';
import { unstable_noStore as noStore } from 'next/cache';

export const getVerificationTokenByToken = async (token: string) => {
  noStore();
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (vt, { eq }) => eq(vt.token, token.trim()),
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  noStore();
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (vt, { eq }) => eq(vt.email, email),
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
};
