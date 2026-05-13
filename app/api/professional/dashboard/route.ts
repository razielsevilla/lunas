import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PROFESSIONAL');

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!professionalProfile) {
      return HTTP.notFound('Professional profile');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    // Scans today: count access logs today with SUCCESS
    const scansToday = await prisma.accessLog.count({
      where: {
        professionalProfileId: professionalProfile.id,
        status: 'SUCCESS',
        accessedAt: {
          gte: today,
        },
      },
    });

    // Patients this week: distinct patientIds accessed this week
    const patientsThisWeekResult = await prisma.accessLog.findMany({
      where: {
        professionalProfileId: professionalProfile.id,
        status: 'SUCCESS',
        accessedAt: {
          gte: weekAgo,
        },
      },
      select: {
        patientProfileId: true,
      },
      distinct: ['patientProfileId'],
    });
    const patientsThisWeek = patientsThisWeekResult.length;

    // Pending notes: for now, 0 (no notes system yet)
    const pendingNotes = 0;

    // Recent patients: last 5 accessed patients
    const recentAccessLogs = await prisma.accessLog.findMany({
      where: {
        professionalProfileId: professionalProfile.id,
        status: 'SUCCESS',
      },
      orderBy: {
        accessedAt: 'desc',
      },
      take: 5,
      include: {
        patientProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    const recentPatients = recentAccessLogs.map(log => ({
      id: log.patientProfile.id,
      firstName: log.patientProfile.user.firstName,
      lastName: log.patientProfile.user.lastName,
      accessedAt: log.accessedAt,
    }));

    return Response.json({
      scansToday,
      patientsThisWeek,
      pendingNotes,
      prcStatus: professionalProfile.prcStatus,
      recentPatients,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
