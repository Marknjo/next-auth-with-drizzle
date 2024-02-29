'use client';

import { UserInfo } from '@/components/global/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';

function ClientPage() {
  const user = useCurrentUser();

  return <UserInfo label='📱 Client Component' user={user} />;
}
export default ClientPage;
