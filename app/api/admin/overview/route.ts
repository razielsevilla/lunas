import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/admin/overview
// Returns system-wide stats for the admin dashboard.
// Requires ADMIN role.
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    await requireRole(req, 'ADMIN');

    const [
      totalPatients,
      totalProfessionals,
      pendingVerifications,
      totalAccessLogs,
      recentAccessLogs,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'PATIENT' } }),
      prisma.user.count({ where: { role: 'PROFESSIONAL' } }),
      prisma.professionalProfile.count({ where: { prcStatus: 'PENDING' } }),
      prisma.accessLog.count(),
      prisma.accessLog.findMany({
        take: 10,
        orderBy: { accessedAt: 'desc' },
        include: {
          patientProfile: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          professionalProfile: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
        },
      }),
    ]);

    return Response.json({
      stats: {
        totalPatients,
        totalProfessionals,
        pendingVerifications,
        totalAccessLogs,
      },
      recentActivity: recentAccessLogs.map((log) => ({
        id: log.id,
        accessedAt: log.accessedAt,
        status: log.status,
        patientName: `${log.patientProfile.user.firstName} ${log.patientProfile.user.lastName}`,
        professionalName: `${log.professionalProfile.user.firstName} ${log.professionalProfile.user.lastName}`,
        prcNumber: log.professionalProfile.prcNumber,
      })),
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
