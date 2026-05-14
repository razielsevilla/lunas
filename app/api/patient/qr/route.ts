import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateQrImage } from '@/lib/qr';

// ---------------------------------------------------------------------------
// GET /api/patient/qr
//
// Returns the current patient's QR UUID and the rendered base64 PNG image.
// Requires PATIENT role.
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    // 1. Authenticate user and verify role
    const session = await requireRole(req, 'PATIENT');

    // 2. Fetch the patient's profile to get their QR UUID
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { 
        qrUuid: true,
        user: { select: { firstName: true, lastName: true } }
      },
    });

    if (!patientProfile) {
      return Response.json(
        { error: 'Patient profile not found.' },
        { status: 404 }
      );
    }

    const { qrUuid } = patientProfile;

    // 3. Generate the base64 PNG
    const qrImageBase64 = await generateQrImage(qrUuid);

    // 4. Return the data
    return Response.json(
      {
        qrUuid,
        qrImageBase64,
        firstName: patientProfile.user.firstName,
        lastName: patientProfile.user.lastName,
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err.name === 'AuthError') {
      return Response.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('[api/patient/qr]', err);
    return Response.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
