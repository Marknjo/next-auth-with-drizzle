import { db } from '@/db';

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.query.account.findFirst({
      where: (account, { eq }) => eq(account.userId, userId),
    });

    return account;
  } catch (error) {
    return null;
  }
};
