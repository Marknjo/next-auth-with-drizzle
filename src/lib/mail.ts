'use server';

import { Resend } from 'resend';
import { isProd } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: '2FA Code',
      html: `<p>Your 2FA code: ${token}<p>`,
    });

    return {
      success: "We've set a password reset token to your email",
    };
  } catch (error) {
    return { error: 'Error while trying to verify your account' };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const url = isProd ? process.env.PROD_URL : process.env.DEV_URL;
  const resetLink = `${url}/auth/password-reset?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">Here</a> to reset your account password<p>`,
    });

    return {
      success: "We've set a password reset token to your email",
    };
  } catch (error) {
    return { error: 'Error while trying to verify your account' };
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = isProd ? process.env.PROD_URL : process.env.DEV_URL;

  const confirmLink = `${url}/auth/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your account<p>`,
    });

    return {
      success: 'Confirmation email sent!',
    };
  } catch (error) {
    return { error: 'Error while trying to verify your account' };
  }
};
