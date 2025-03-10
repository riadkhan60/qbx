import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forget-password(.*)',
  '/callback(.*)',
  '/api/users(.*)',
]);

// Add a matcher for API routes that need authentication

export default clerkMiddleware(async (auth, request) => {
  const cookieStore = await cookies();
  let route = 'sign-up'; // default route

  const storedRoute = cookieStore.get('baseRoute');

  if (!storedRoute) {
    cookieStore.set('baseRoute', 'sign-in', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  } else {
    route = storedRoute.value;
  }

  const baseUrl = `${new URL(route, request.url).href}`;


  // For non-API routes, continue with the regular protection
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthorizedUrl: baseUrl,
      unauthenticatedUrl: baseUrl,
    });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
