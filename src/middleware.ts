import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
// import { auth } from '@/auth';

import {
  DEFAULT_SIGNIN_REDIRECT,
  authRoutes,
  apiAuthPrefix,
  publicRoutes,
} from '@/middleware.routes';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAPiAuthPrefix = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAPiAuthPrefix) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
