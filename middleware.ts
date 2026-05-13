import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ---------------------------------------------------------------------------
// Route protection map
//
// Defines which URL prefixes require authentication and what role(s) are
// permitted. The middleware checks the session cookie on every matching
// request BEFORE the page/route handler runs.
// ---------------------------------------------------------------------------

type RouteRule = {
  prefix: string;
  allowedRoles: ('PATIENT' | 'PROFESSIONAL' | 'ADMIN')[];
  redirectTo: string;
};

const PROTECTED_ROUTES: RouteRule[] = [
  {
    prefix: '/patient',
    allowedRoles: ['PATIENT'],
    redirectTo: '/login',
  },
  {
    prefix: '/professional',
    allowedRoles: ['PROFESSIONAL'],
    redirectTo: '/login',
  },
  {
    prefix: '/admin',
    allowedRoles: ['ADMIN'],
    redirectTo: '/login',
  },
];

// Routes accessible only when NOT authenticated (redirect to dashboard if already logged in)
const AUTH_ONLY_ROUTES = ['/login', '/register'];

// Routes that are always public regardless of auth state
const PUBLIC_ROUTES = ['/scan', '/api/auth', '/api/scan'];

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----- 1. Always allow public routes and static assets -----
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    PUBLIC_ROUTES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // ----- 2. Read session token from cookie -----
  const token = req.cookies.get('session')?.value ?? null;
  let session: Awaited<ReturnType<typeof getSessionFromToken>> = null;

  if (token) {
    session = await getSessionFromToken(token);
  }

  // ----- 3. Redirect authenticated users away from auth-only routes -----
  if (AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    if (session) {
      // Redirect to the correct dashboard based on role
      const dashboardUrl = getDashboardUrl(session.role);
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    return NextResponse.next();
  }

  // ----- 4. Enforce role-based access on protected routes -----
  for (const rule of PROTECTED_ROUTES) {
    if (pathname.startsWith(rule.prefix)) {
      // Not authenticated → send to login
      if (!session) {
        const loginUrl = new URL(rule.redirectTo, req.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Authenticated but wrong role → send to correct dashboard
      if (!rule.allowedRoles.includes(session.role as 'PATIENT' | 'PROFESSIONAL' | 'ADMIN')) {
        const dashboardUrl = getDashboardUrl(session.role);
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }

      // All good — allow through
      return NextResponse.next();
    }
  }

  // ----- 5. Allow everything else (landing page, etc.) -----
  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SessionRow = {
  role: string;
  userId: string;
};

/**
 * Reads and validates the session token directly against the DB.
 * Returns null if invalid or expired.
 *
 * Note: This runs in the Edge-compatible middleware context, so we use
 * the standard Prisma client (Railway PostgreSQL over TCP is compatible).
 */
async function getSessionFromToken(
  token: string
): Promise<SessionRow | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: { select: { id: true, role: true } },
      },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) return null;

    return {
      userId: session.user.id,
      role: session.user.role,
    };
  } catch {
    // If DB is unavailable, fail open (allow request) rather than hard-blocking users
    console.error('[middleware] DB session lookup failed');
    return null;
  }
}

function getDashboardUrl(role: string): string {
  switch (role) {
    case 'PATIENT':
      return '/patient/dashboard';
    case 'PROFESSIONAL':
      return '/professional/dashboard';
    case 'ADMIN':
      return '/admin/overview';
    default:
      return '/';
  }
}

// ---------------------------------------------------------------------------
// Matcher config — only run middleware on relevant paths (not static assets)
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
