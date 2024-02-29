'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { getUserByEmail, getUserById } from '@/db/queries/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { TSettingsSchema } from '@/schemas';
import { users } from '@/db/schemas';

export const settings = async (values: TSettingsSchema) => {
  const user = await currentUser();

  if (!user || !user?.id) {
    return { error: 'Unauthorized' };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: 'Unauthorized' };
  }

  /// remove indifferent fields
  const mappedValues = Object.entries(values);

  mappedValues.forEach((value) => {
    const key: keyof typeof dbUser = value.at(0) as keyof typeof dbUser;
    const keyVal: keyof typeof values = value.at(0) as keyof typeof values;

    if (dbUser[key] === value.at(1)) {
      delete values[keyVal];
    }
  });

  if (Object.values(values).every((val) => !val)) {
    // @TODO: Add it as a warning instead
    return { error: 'No field update!' };
  }

  /// Don't update these fields for OAuth
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  /// Handle email change update
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email already in use!' };
    }

    const plainToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(values.email, plainToken);

    return { success: 'Verification email sent!' };
  }

  /// Handle new password update
  if (values.password && values.newPassword && dbUser?.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: 'Incorrect password!' };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 12);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  /// update field
  await db.update(users).set(values).where(eq(users.id, dbUser.id));

  /// return success message
  return { success: 'Settings updated!' };
};
