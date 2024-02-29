'use client';

import UserButton from '@/components/auth/buttons/user-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routes = [
  {
    path: 'server',
    title: 'Server',
  },
  {
    path: 'client',
    title: 'Client',
  },
  {
    path: 'admin',
    title: 'Admin',
  },
  {
    path: 'settings',
    title: 'Settings',
  },
];

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm'>
      <div className='flex gap-x-2'>
        {routes.map((route) => (
          <Button
            key={route.path}
            asChild
            variant={pathname === `/${route.path}` ? 'default' : 'outline'}>
            <Link href={`/${route.path}`}>{route.title}</Link>
          </Button>
        ))}
      </div>
      <UserButton />
    </nav>
  );
}
export default Navbar;
