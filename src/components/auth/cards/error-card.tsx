import { AlertTriangle } from 'lucide-react';

import CardWrapper from './card-wrapper';

function ErrorCard() {
  return (
    <CardWrapper
      headerLabel='Oops! Something went wrong!'
      backButtonHref='/auth/signin'
      backButtonLabel='Back to Signin'>
      <div className='w-full flex justify-center items-center'>
        <AlertTriangle className='text-destructive h-8 w-8' />
      </div>
    </CardWrapper>
  );
}
export default ErrorCard;
