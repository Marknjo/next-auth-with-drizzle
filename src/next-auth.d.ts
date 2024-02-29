import { type DefaultSession } from 'next-auth';
import { ERoles } from './db/types';

export type ExtendUser = {
  role: ERoles;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
} & DefaultSession['user'];

declare module 'next-auth' {
  interface Session {
    user: ExtendUser;
  }
}
