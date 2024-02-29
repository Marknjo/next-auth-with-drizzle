'use server';

import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';

type Props = {
  children: React.ReactNode;
};

async function NextAuthProvider({ children }: Props) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
export default NextAuthProvider;
