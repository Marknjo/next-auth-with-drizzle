'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const currentUser = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  return user;
};

export const currentRole = async () => {
  const user = await currentUser();

  return user?.role;
};
