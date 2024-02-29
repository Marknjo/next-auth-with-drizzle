import { UserInfo } from '@/components/global/user-info';
import { currentUser } from '@/lib/auth';

async function ServerPage() {
  const user = await currentUser();

  return <UserInfo label='💻 Server Component' user={user} />;
}
export default ServerPage;
