import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

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
      return HTTP.notFound('Professional profile');
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
      hospitalAffiliation: professionalProfile.hospitalAffil,
      prcStatus: professionalProfile.prcStatus,
      pinSet: !!professionalProfile.pin,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
