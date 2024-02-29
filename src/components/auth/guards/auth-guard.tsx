import { currentUser } from '@/lib/auth';

type Props = {
  children: React.ReactNode;
};

export async function AuthGuard({ children }: Props) {
  await currentUser();

  return <>{children}</>;
}
