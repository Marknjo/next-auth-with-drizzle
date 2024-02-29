'use client';

import { toast } from 'sonner';

import { admin } from '@/actions/admin';
import { Button } from '@/components/ui/button';

export const ServerActionButton = () => {
  const handleServerActionClick = async () => {
    const response = await admin();

    if (response?.error) {
      toast.warning(response.error);
    }

    if (response?.success) {
      toast.success(response.success);
    }
  };

  return <Button onClick={handleServerActionClick}>Click to test</Button>;
};
