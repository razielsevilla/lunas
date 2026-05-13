import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/patient/access-logs
// Returns the access history for the authenticated patient's profile.
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return Response.json({ error: 'Patient profile not found.' }, { status: 404 });
    }

    const logs = await prisma.accessLog.findMany({
      where: { patientProfileId: profile.id },
      include: {
        professionalProfile: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { accessedAt: 'desc' },
      take: 50, // Cap at 50 most recent
    });

    const formatted = logs.map((log) => ({
      id: log.id,
      accessedAt: log.accessedAt,
      status: log.status,
      durationSeconds: log.durationSeconds,
      professional: {
        name: `${log.professionalProfile.user.firstName} ${log.professionalProfile.user.lastName}`,
        prcNumber: log.professionalProfile.prcNumber,
        profession: log.professionalProfile.profession,
      },
    }));

    return Response.json({ logs: formatted });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
