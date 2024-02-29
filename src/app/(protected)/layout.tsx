import { AuthGuard } from '@/components/auth/guards/auth-guard';
import Navbar from './_components/navbar';

async function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <main className='min-h-full flex flex-col gap-y-10 items-center pt-6 pb-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
        <Navbar />
        {children}
      </main>
    </AuthGuard>
  );
}
export default ManagementLayout;
