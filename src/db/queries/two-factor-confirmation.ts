import { db } from '@/db';

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = db.query.twoFactorConfirmations.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
