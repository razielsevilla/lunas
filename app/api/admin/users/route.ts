import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/admin/users
// Returns a paginated user list for the admin panel.
// Requires ADMIN role.
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    await requireRole(req, 'ADMIN');

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const role = searchParams.get('role'); // Optional filter: PATIENT | PROFESSIONAL | ADMIN
    const skip = (page - 1) * limit;

    const where = role ? { role: role as 'PATIENT' | 'PROFESSIONAL' | 'ADMIN' } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          mobile: true,
          createdAt: true,
          professionalProfile: {
            select: {
              prcNumber: true,
              profession: true,
              prcStatus: true,
            },
          },
          patientProfile: {
            select: {
              profileComplete: true,
              qrUuid: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return Response.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
