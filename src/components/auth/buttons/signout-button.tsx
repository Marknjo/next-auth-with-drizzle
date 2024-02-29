'use client';

import { signOut } from '@/actions/signout';

type Props = {
  children: React.ReactNode;
};

function SignoutButton({ children }: Props) {
  function handleLogout() {
    signOut();
  }

  return (
    <span
      onClick={handleLogout}
      className='cursor-pointer flex flex-nowrap w-full'>
      {children}
    </span>
  );
}
export default SignoutButton;
