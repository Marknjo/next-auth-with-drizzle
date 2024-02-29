'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BeatLoader } from 'react-spinners';

import FormError from '@/components/global/form-error';
import FormSuccess from '@/components/global/form-success';
import { newVerificationToken } from '@/actions/new-verification';
import CardWrapper from './cards/card-wrapper';

function VerifyForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const handleOnSubmit = useCallback(() => {
    if (!token) {
      setError('Verification token missing!');
      return;
    }

    newVerificationToken(token)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
      .catch((err) => {
        setError('Failed to process token! Please try again.');
      });
  }, [token]);

  useEffect(() => {
    handleOnSubmit();
  }, [handleOnSubmit]);

  return (
    <CardWrapper
      headerLabel='Hug In there! Verifying Your Token'
      backButtonLabel='Back to Signin'
      backButtonHref='/auth/signin'>
      <div className='flex flex-col items-center w-full justify-center'>
        {!success && !error && <BeatLoader />}

        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
}
export default VerifyForm;
