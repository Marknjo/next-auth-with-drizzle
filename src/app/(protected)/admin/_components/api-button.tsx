'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const ApiButton = () => {
  const handleApiRouteClick = async () => {
    const res = await fetch('/api/admin');

    const data: { message: string } = await res.json();

    if (res.status === 403) {
      toast.warning(data.message);
    }

    toast.success(data.message);
  };

  return <Button onClick={handleApiRouteClick}>Click to test</Button>;
};
