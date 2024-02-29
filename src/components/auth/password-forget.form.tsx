'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';

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

import { ResetSchema, TResetSchema } from '@/schemas';
import { passwordForget } from '@/actions/password-forget';

function PasswordForgetForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const defaultEmail = searchParams.get('email');

  const form = useForm<TResetSchema>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: defaultEmail || '',
    },
  });

  console.log();

  const handleSubmit = (values: TResetSchema) => {
    startTransition(() => {
      passwordForget(values)
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
      headerLabel='Forget Your Password?'
      backButtonLabel='Back to Signin'
      backButtonHref='/auth/signin'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='space-y-4'>
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
                      required
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type='submit' disabled={isPending} className='w-full'>
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
export default PasswordForgetForm;
