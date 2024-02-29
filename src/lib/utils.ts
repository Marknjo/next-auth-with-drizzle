import { type ClassValue, clsx } from 'clsx';
import { env } from 'process';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isText = env.NODE_ENV === 'test';
