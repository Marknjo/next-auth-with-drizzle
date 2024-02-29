'use client';

import { useState, useTransition } from 'react';
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
import { SignupSchema, TSignupSchema } from '@/schemas';
import { signup } from '@/actions/signup';
import { PasswordFieldToggler } from './buttons/password-field-toggler-button';

function SignupForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [showRawPass, setShowRawPass] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TSignupSchema>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const handleSubmit = (values: TSignupSchema) => {
    startTransition(() => {
      signup(values)
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
      headerLabel='Create An Account'
      backButtonLabel='Have an account? Signin'
      backButtonHref='/auth/signin'
      showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
                      type='text'
                      required
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type='submit' disabled={isPending} className='w-full'>
            Create My Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
export default SignupForm;
