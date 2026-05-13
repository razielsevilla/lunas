import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse, hashPassword } from '@/lib/auth';
import { logAdminEvent, AuditEvent } from '@/lib/audit';
import { sendEmail } from '@/lib/mailer';

// ---------------------------------------------------------------------------
// GET /api/admin/verifications — list professionals pending PRC verification
// POST /api/admin/verifications/:id/approve — generate PIN, hash, store, email
// POST /api/admin/verifications/:id/reject  — mark rejected, notify professional
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'ADMIN');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? 'PENDING';

    const professionals = await prisma.professionalProfile.findMany({
      where: {
        prcStatus: status as 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED',
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ professionals });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
