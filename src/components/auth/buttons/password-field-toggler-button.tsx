import { Dispatch, SetStateAction } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PasswordFieldToggler({
  onToggle,
  isToggled,
  className,
}: {
  onToggle: Dispatch<SetStateAction<boolean>>;
  isToggled: boolean;
  className?: string;
}) {
  return (
    <Button
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        onToggle((prev) => !prev);
      }}
      size='sm'
      variant='link'
      className={cn(
        'p-0 absolute top-1/2 right-2 transform -translate-y-[25%] hidden group-hover:block',
        className
      )}>
      {isToggled ? (
        <EyeOff className='size-5 text-muted-foreground hover:text-gray-600' />
      ) : (
        <Eye className='size-5 text-muted-foreground hover:text-gray-600' />
      )}
    </Button>
  );
}
