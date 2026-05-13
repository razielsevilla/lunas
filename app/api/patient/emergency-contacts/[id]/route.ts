import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';
import { HTTP } from '@/lib/api';

// ---------------------------------------------------------------------------
// DELETE /api/patient/emergency-contacts/[id]
// ---------------------------------------------------------------------------

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await requireRole(req, 'PATIENT');
    const { id } = await params;

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) return HTTP.notFound('Patient profile');

    const contact = await prisma.emergencyContact.findFirst({
      where: { id, patientProfileId: profile.id },
    });

    if (!contact) return HTTP.notFound('Emergency contact');

    if (contact.patientProfileId !== profile.id) {
      return HTTP.forbidden('You do not have permission to delete this emergency contact.');
    }

    await prisma.emergencyContact.delete({ where: { id } });

    return Response.json({
      message: `Emergency contact "${contact.name}" removed successfully.`,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
