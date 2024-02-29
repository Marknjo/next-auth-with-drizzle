'use server';

import { getUserByEmail } from '@/db/queries/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetSchema, TResetSchema } from '@/schemas';

export const passwordForget = async (values: TResetSchema) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Please provide a valid email!' };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: 'Email not found!' };
    }

    const plainToken = await generatePasswordResetToken(email);

    const response = await sendPasswordResetEmail(email, plainToken);

    return {
      success: response?.success,
    };
  } catch (error) {
    return { error: `Failed to reset your password. Please try again later` };
  }
};
