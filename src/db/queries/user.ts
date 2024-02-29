'use server';

import { db } from '@/db';

export async function getUserByEmail(email: string) {
  try {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, id),
    });
  } catch (error) {
    return null;
  }
}
