'use server';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

import { getPasswordResetTokenByToken } from '@/db/queries/password-reset-token';
import { db } from '@/db';
import { NewPasswordSchema, TNewPasswordSchema } from '@/schemas';
import { getUserByEmail } from '@/db/queries/user';
import { passwordResetTokens, users } from '@/db/schemas';
import { decryptToken } from '../lib/tokens';

export const passwordReset = async (
  values: TNewPasswordSchema,
  token?: string | null
) => {
  if (!token) {
    return { error: 'Missing token' };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Please provide your new password!' };
  }

  const { password } = validatedFields.data;

  try {
    const decryptedToken = decryptToken(token)!;
    const existingToken = await getPasswordResetTokenByToken(decryptedToken);

    if (!existingToken) {
      return { error: 'Token not found!' };
    }

    const hasExpired = new Date(existingToken.expires).getTime() < Date.now();

    if (hasExpired) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
      return { error: 'Invalid token!' };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: 'Invalid user credentials!' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.email, existingToken.email));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));

    return {
      success: 'Your password was updated',
    };
  } catch (error) {
    return { error: `Failed to reset your password. Please try again later` };
  }
};
