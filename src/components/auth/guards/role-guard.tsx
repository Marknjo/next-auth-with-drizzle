'use server';

import FormError from '@/components/global/form-error';
import { ERoles } from '@/db/types';

import { currentRole } from '@/lib/auth';

type Props = {
  children: React.ReactNode;
  allowedRole: ERoles;
};

export async function RoleGuard({ children, allowedRole }: Props) {
  const role = await currentRole();

  if (role !== allowedRole) {
    return (
      <FormError message='You do not have permission to view this content!' />
    );
  }

  return <>{children}</>;
}
