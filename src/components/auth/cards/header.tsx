import { cn } from '@/lib/utils';
import { poppins } from '@/components/global/fonts';

type Props = {
  label: string;
};

function Header({ label }: Props) {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <h1
        className={cn('text-3xl font-semibold antialiased', poppins.className)}>
        🔐 Auth
      </h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
}
export default Header;
