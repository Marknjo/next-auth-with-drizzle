import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export function useCurrentUser() {
  const session = useSession();

  const user = session.data?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  return user!;
}
