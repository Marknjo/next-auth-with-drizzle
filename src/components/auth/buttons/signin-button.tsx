'use client';

import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import SigninForm from '@/components/auth/signin.form';

type Props = {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
};

function SigninButton({ children, asChild, mode = 'redirect' }: Props) {
  const router = useRouter();

  const handleOnClick = () => {
    router.push('/auth/signin');
  };

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className='p-0 w-auto bg-transparent border-none'>
          <SigninForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span className='cursor-pointer' onClick={handleOnClick}>
      {children}
    </span>
  );
}
export default SigninButton;
