'use server';

import { db } from '@/db';

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: (pst, { eq }) => eq(pst.token, token),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: (pst, { eq }) => eq(pst.email, email),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
