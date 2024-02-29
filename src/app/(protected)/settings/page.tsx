'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { SettingsSchema, TSettingsSchema } from '@/schemas';
import { settings } from '@/actions/settings';
import { useCurrentUser } from '@/hooks/use-current-user';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ERoles } from '@/db/types';
import FormError from '@/components/global/form-error';
import FormSuccess from '@/components/global/form-success';

function SettingsPage() {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const form = useForm<TSettingsSchema>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const handleUpdateSettings = (values: TSettingsSchema) => {
    startTransition(async () => {
      try {
        const data = await settings(values);

        if (data.error) {
          setError(data.error);
          setSuccess(undefined);
        }

        if (data.success) {
          setSuccess(data.success);
          setError(undefined);
          update();
        }
      } catch (error) {
        setError('Something went wrong!');
        setSuccess(undefined);
      }
    });
  };

  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateSettings)}
            className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='John Doe'
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {user?.isOAuth || (
                <>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='john.doe@example.com'
                            type='email'
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='******'
                            type='password'
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='******'
                            type='password'
                            disabled={isPending}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='isTwoFactorEnabled'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                        <div className='space-y-0 5'>
                          <FormLabel>Two Factor Authentication</FormLabel>

                          <FormDescription>
                            Enable two factor authentication for your account
                          </FormDescription>
                        </div>

                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>

                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a Role' />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={ERoles.ADMIN}>Admin</SelectItem>
                        <SelectItem value={ERoles.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button type='submit'>⚙️ Update Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
export default SettingsPage;
