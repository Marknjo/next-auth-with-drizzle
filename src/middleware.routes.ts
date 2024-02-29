/**
 * An array of routes that are accessible to public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', '/auth/verify'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
  '/auth/signin',
  '/auth/signup',
  '/auth/password-reset',
  '/auth/password-forget',
  '/auth/error',
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API
 * authentication purpose
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_SIGNIN_REDIRECT: string = '/settings';
