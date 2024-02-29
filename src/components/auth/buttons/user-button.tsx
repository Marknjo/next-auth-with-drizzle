'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/use-current-user';
import SignoutButton from '@/components/auth/buttons/signout-button';
import { LogOut } from 'lucide-react';

function UserButton() {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className='bg-sky-500'>
            <FaUser className='text-white' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuItem>
          <SignoutButton>
            <LogOut className='h-4 w-4 mr-2' /> Logout
          </SignoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserButton;
