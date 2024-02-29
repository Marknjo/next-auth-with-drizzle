import * as z from 'zod';
import { ERoles } from '../db/types';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.optional(z.enum([ERoles.ADMIN, ERoles.USER])),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    { message: 'New Password is required!', path: ['newPassword'] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    { message: 'Password is required!', path: ['password'] }
  );
export type TSettingsSchema = z.infer<typeof SettingsSchema>;

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: 'Password must be more than 6 characters',
    }),
    passwordConfirm: z.string().min(6, {
      message: 'Password must be more than 6 characters',
    }),
  })
  .refine(
    (field) => {
      if (field.passwordConfirm !== field.password) {
        return false;
      }

      return true;
    },
    {
      path: ['passwordConfirm'],
      message: 'Password do not match',
    }
  );
export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});
export type TResetSchema = z.infer<typeof ResetSchema>;

export const SigninSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(
    z.string().length(6, {
      message: 'Invalid 2FA code',
    })
  ),
});
export type TSigninSchema = z.infer<typeof SigninSchema>;

export const SignupSchema = z.object({
  name: z.string().min(1, {
    message: 'Username is required',
  }),
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Password must be more than 6 characters',
  }),
});
export type TSignupSchema = z.infer<typeof SignupSchema>;
