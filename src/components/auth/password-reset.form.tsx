'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import CardWrapper from '@/components/auth/cards/card-wrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormError from '@/components/global/form-error';
import FormSuccess from '@/components/global/form-success';
import { NewPasswordSchema, TNewPasswordSchema } from '@/schemas';
import { passwordReset } from '@/actions/password-reset';
import { PasswordFieldToggler } from './buttons/password-field-toggler-button';

function PasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [showRawPass, setShowRawPass] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<TNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSubmit = (values: TNewPasswordSchema) => {
    startTransition(() => {
      passwordReset(values, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
          if (data?.success) {
            form.reset();
          }
        })
        .catch(() =>
          setError(
            'Something happened while trying to log you in! Please try again.'
          )
        );
    });
  };

  return (
    <CardWrapper
      headerLabel='Enter a New Password?'
      backButtonLabel='Back to signin'
      backButtonHref='/auth/signin'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='relative group'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={showRawPass ? 'Your password' : '******'}
                      type={showRawPass ? 'text' : 'password'}
                      required
                      disabled={isPending}
                    />
                  </FormControl>

                  <PasswordFieldToggler
                    onToggle={setShowRawPass}
                    isToggled={showRawPass}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem className='relative group'>
                  <FormLabel>Password Confirm</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={showRawPass ? 'Your password' : '******'}
                      type={showRawPass ? 'text' : 'password'}
                      required
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />

                  <PasswordFieldToggler
                    onToggle={setShowRawPass}
                    isToggled={showRawPass}
                  />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type='submit' disabled={isPending} className='w-full'>
            Reset Your Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
export default PasswordResetForm;
