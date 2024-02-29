import { Card, CardContent, CardHeader } from '@/components/ui/card';
import FormSuccess from '@/components/global/form-success';
import { ERoles } from '@/db/types';
import { RoleGuard } from '@/components/auth/guards/role-guard';
import { ServerActionButton } from './_components/server-action-button';
import { ApiButton } from './_components/api-button';

function AdminPage() {
  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>🔑 Admin Only</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <RoleGuard allowedRole={ERoles.ADMIN}>
          <FormSuccess message='You are allowed to see this content!' />

          <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
            <p className='text-sm font-medium'>Admin-only API Route</p>
            <ApiButton />
          </div>
          <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
            <p className='text-sm font-medium'>Admin-only Server Action</p>
            <ServerActionButton />
          </div>
        </RoleGuard>
      </CardContent>
    </Card>
  );
}
export default AdminPage;
