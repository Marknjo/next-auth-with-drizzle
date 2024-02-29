'use server';

import { db } from '@/db';

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: (tft, { eq }) => eq(tft.token, token),
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: (tft, { eq }) => eq(tft.email, email),
    });

    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
