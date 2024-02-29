'use server';

import { eq } from 'drizzle-orm';

import { getUserByEmail } from '@/db/queries/user';
import { getVerificationTokenByToken } from '@/db/queries/verification-token';
import { db } from '@/db';
import { users, verificationTokens } from '@/db/schemas';
import { decryptToken } from '@/lib/tokens';

export const newVerificationToken = async (token: string) => {
  const hashedToken = decryptToken(token)!;

  const existingToken = await getVerificationTokenByToken(hashedToken);

  if (!existingToken) return { error: 'Token does not exist' };

  console.log(existingToken);

  const hasExpired = new Date(existingToken.expires).getTime() < Date.now();

  console.log({
    expires: new Intl.DateTimeFormat('en-ke', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(existingToken.expires)),
  });

  if (hasExpired) return { error: 'Token has expired!' };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: 'Email does not exist!' };

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, existingToken.id));

  return { success: 'Your account was successfully verified' };
};
