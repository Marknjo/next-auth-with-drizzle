'use server';

import { currentRole } from '@/lib/auth';
import { ERoles } from '@/db/types';

export const admin = async () => {
  const role = await currentRole();

  if (role === ERoles.ADMIN) {
    return { success: 'Success! You can access this admin route' };
  }

  return { error: 'Access permission denied!' };
};
