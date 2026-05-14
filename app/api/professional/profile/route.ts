import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PROFESSIONAL');

    const professionalProfile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
      },
    });

    if (!professionalProfile) {
      return Response.json({ error: 'Professional profile not found.' }, { status: 404 });
    }

    return Response.json({
      id: professionalProfile.id,
      firstName: professionalProfile.user.firstName,
      lastName: professionalProfile.user.lastName,
      email: professionalProfile.user.email,
      mobile: professionalProfile.user.mobile,
      prcNumber: professionalProfile.prcNumber,
      profession: professionalProfile.profession,
      specialization: professionalProfile.specialization,
      hospitalAffiliation: professionalProfile.hospitalAffiliation,
      prcStatus: professionalProfile.prcStatus,
      pinSet: !!professionalProfile.pin,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
