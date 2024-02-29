'use server';

import crypto from 'node:crypto';
import { unstable_noStore as noStore } from 'next/cache';

import { getVerificationTokenByEmail } from '@/db/queries/verification-token';
import { db } from '@/db';
import { getPasswordResetTokenByEmail } from '@/db/queries/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/db/queries/two-factor-token';
import {
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { env } from 'node:process';

const genToken = (is2FAToken: boolean = false, length: number = 32) => {
  let plainToken: string;

  // Create reset token

  if (is2FAToken) {
    plainToken = crypto.randomInt(100_000, 1_000_000).toString();
  } else {
    plainToken = crypto.randomBytes(32).toString('hex');
  }

  // Has the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(plainToken)
    .digest('hex');

  return { plainToken, hashedToken };
};

export const decryptToken = (token?: string) => {
  if (!token) return;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  return hashedToken;
};

export const generateTwoFactorToken = async (email: string) => {
  noStore();

  // TODO: later change to 15 minutes - production
  const expires = new Date(Date.now() + +env.TWOFA_TOKEN_EXPIRES! * 1000);

  try {
    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, existingToken.id));
    }

    const { hashedToken, plainToken } = genToken(true);

    await db.insert(twoFactorTokens).values({
      email,
      token: hashedToken,
      expires,
    });

    return plainToken;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  noStore();

  const expires = new Date(
    new Date().getTime() + +env.RESET_TOKEN_EXPIRES! * 1000
  );

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  const { hashedToken, plainToken } = genToken(true);

  await db.insert(passwordResetTokens).values({
    email,
    token: hashedToken,
    expires,
  });

  return plainToken;
};

export const generateVerificationToken = async (email: string) => {
  noStore();

  const expires = new Date(Date.now() + +env.VERIFY_TOKEN_EXPIRES! * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  const { hashedToken, plainToken } = genToken(true);

  await db
    .insert(verificationTokens)
    .values({
      email,
      token: hashedToken,
      expires,
    })
    .returning();

  return plainToken;
};
