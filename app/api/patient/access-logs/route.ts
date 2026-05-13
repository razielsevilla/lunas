import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

// ---------------------------------------------------------------------------
// GET /api/patient/access-logs — paginated access history
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));
    const skip  = (page - 1) * limit;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    const [logs, total] = await Promise.all([
      prisma.accessLog.findMany({
        where: { patientProfileId: profile.id },
        include: {
          professionalProfile: {
            include: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { accessedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.accessLog.count({ where: { patientProfileId: profile.id } }),
    ]);

    return Response.json({
      logs: logs.map((log) => ({
        id: log.id,
        accessedAt: log.accessedAt,
        status: log.status,
        durationSeconds: log.durationSeconds,
        professional: {
          name: `${log.professionalProfile.user.firstName} ${log.professionalProfile.user.lastName}`,
          prcNumber: log.professionalProfile.prcNumber,
          profession: log.professionalProfile.profession,
        },
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
