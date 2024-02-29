'use server';

import { AuthError } from 'next-auth';
import { eq } from 'drizzle-orm';

import { signIn } from '@/auth';
import { getTwoFactorConfirmationByUserId } from '@/db/queries/two-factor-confirmation';
import { getTwoFactorTokenByEmail } from '@/db/queries/two-factor-token';
import { getUserByEmail } from '@/db/queries/user';
import { db } from '@/db';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import {
  decryptToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { SigninSchema, TSigninSchema } from '@/schemas';
import { twoFactorConfirmations, twoFactorTokens } from '@/db/schemas';
import { DEFAULT_SIGNIN_REDIRECT } from '@/middleware.routes';

export const signin = async (
  values: TSigninSchema,
  callbackUrl: string | null
) => {
  const validatedFields = SigninSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error);

    return { error: 'Invalid field values!' };
  }

  const { email, password, code: plainCode } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser?.email || !existingUser?.password) {
    return { error: 'Invalid credentials!' };
  }

  if (!existingUser.emailVerified) {
    const plainToken = await generateVerificationToken(existingUser.email);

    const response = await sendVerificationEmail(
      existingUser.email,
      plainToken
    );

    if (response.error) {
      return { error: response.error };
    }

    return {
      success:
        "Oops! Your account is not verified! But we've sent you an email to confirm your account.",
    };
  }

  if (existingUser!.isTwoFactorEnabled && existingUser.email) {
    const code = decryptToken(plainCode);

    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: 'Invalid code!' };
      }

      if (twoFactorToken.token !== code) {
        return { error: 'Invalid code!' };
      }

      const hasExpired =
        new Date(twoFactorToken.expires).getTime() < Date.now();

      if (hasExpired) {
        return { error: 'Code expired!' };
      }

      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, twoFactorToken.id));

      const existingTokenConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingTokenConfirmation) {
        await db
          .delete(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.id, existingTokenConfirmation.id));
      }

      await db.insert(twoFactorConfirmations).values({
        userId: existingUser.id,
        expires: new Date(Date.now() + 3600 * 1000),
      });
    } else {
      const plainToken = await generateTwoFactorToken(existingUser.email);

      if (!plainToken) {
        return { error: '2FA token generation failed! Please try again' };
      }

      await sendTwoFactorTokenEmail(email, plainToken);

      return { twoFactor: true, data: { email, password } };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_SIGNIN_REDIRECT,
    });

    return { success: 'Signin details sent' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };

        case 'AuthorizedCallbackError':
          return { error: 'Please verify your account!' };

        default:
          return {
            error: 'Something happened during Signin! Please try again',
          };
      }
    }

    throw error;
  }
};
