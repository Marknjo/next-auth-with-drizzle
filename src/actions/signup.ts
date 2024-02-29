'use server';

import bcrypt from 'bcryptjs';

import { SignupSchema, TSignupSchema } from '@/schemas';
import { db } from '@/db';
import { getUserByEmail } from '@/db/queries/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { users } from '@/db/schemas';

export const signup = async (values: TSignupSchema) => {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid field values!', success: undefined };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!', success: undefined };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.insert(users).values({ name, email, password: hashedPassword });

  const plainToken = await generateVerificationToken(email);

  const response = await sendVerificationEmail(email, plainToken);

  return response;
};
