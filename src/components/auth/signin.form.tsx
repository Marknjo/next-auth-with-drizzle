'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import CardWrapper from '@/components/auth/cards/card-wrapper';
import { SigninSchema, TSigninSchema } from '@/schemas';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import FormError from '@/components/global/form-error';
import FormSuccess from '@/components/global/form-success';
import { signin } from '@/actions/signin';
import { CustomOtpInput } from './custom-otp-input';
import { DEFAULT_SIGNIN_REDIRECT } from '@/middleware.routes';
import { PasswordFieldToggler } from './buttons/password-field-toggler-button';

function SigninForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in user with another user!'
      : '';
  const callbackUrl = searchParams.get('callbackUrl');

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [submittedData, setSubmittedData] = useState<Omit<
    TSigninSchema,
    'code'
  > | null>(null);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [showRawPass, setShowRawPass] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<TSigninSchema>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = (values: TSigninSchema) => {
    let updatedValues = values;

    if (submittedData) {
      updatedValues = {
        ...values,
        ...submittedData,
      };
    }

    startTransition(() => {
      signin(updatedValues, callbackUrl)
        .then((data) => {
          setShowTwoFactor(showTwoFactor);
          setSubmittedData(null);

          if (data?.error) {
            setError(data?.error);
          }

          if (data?.success) {
            setSuccess(data?.success);

            form.reset();

            if (showTwoFactor) {
              router.push(callbackUrl || `${DEFAULT_SIGNIN_REDIRECT}`);
            }
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
            setSubmittedData({
              email: data.data.email,
              password: data.data.password,
            });
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
      headerLabel={showTwoFactor ? 'Enter you 2FA Code' : 'Welcome Back'}
      backButtonLabel={`${
        showTwoFactor ? '' : "Don't have an account? Signup!"
      }`}
      backButtonHref={`${showTwoFactor ? '#' : '/auth/signup'}`}
      showSocial={!showTwoFactor}>
      {showTwoFactor && (
        <form
          action={(code: FormData) => {
            const data = Object.fromEntries(code) as TSigninSchema;
            handleSubmit(data);
          }}
          className='space-y-4 px-2'>
          <div className='space-y-4 flex justify-center'>
            <CustomOtpInput
              name='code'
              type='text'
              required
              disabled={isPending}
            />
          </div>

          <FormError message={urlError || error} />
          <FormSuccess message={success} />

          <Button type='submit' disabled={isPending} className='w-full'>
            Confirm
          </Button>
        </form>
      )}

      {!showTwoFactor && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'>
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
                      className='top-[31.5%]'
                    />

                    <Button
                      size='sm'
                      variant='link'
                      className='px-0 font-normal'
                      asChild>
                      <Link
                        href={`/auth/password-forget?email=${form.getValues(
                          'email'
                        )}`}>
                        Forgot Password?
                      </Link>
                    </Button>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={urlError || error} />
            <FormSuccess message={success} />

            <Button type='submit' disabled={isPending} className='w-full'>
              {showTwoFactor ? 'Confirm' : 'Signin'}
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
}
export default SigninForm;
