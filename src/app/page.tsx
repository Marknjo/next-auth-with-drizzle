import SigninButton from '@/components/auth/buttons/signin-button';
import { poppins } from '@/components/global/fonts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function Home() {
  return (
    <main className='flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <div className='space-y-6 text-center'>
        <h1
          className={cn(
            'text-6xl font-semi-bold text-white drop-shadow-md antialiased',
            poppins.className
          )}>
          🔐 Auth
        </h1>

        <p className='text-white text-lg'>A simple Authentication service</p>

        <div>
          <SigninButton mode='redirect' asChild>
            <Button variant='secondary' size='lg'>
              Sign In
            </Button>
          </SigninButton>
        </div>
      </div>
    </main>
  );
}
