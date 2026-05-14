import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/admin/system-health
//
// Returns real DB connectivity status + mock status for other services.
// Used by the admin System Health dashboard page.
// ---------------------------------------------------------------------------

export async function GET(req: Request): Promise<Response> {
  try {
    await requireRole(req, 'ADMIN');

    // Real check: DB connectivity
    let dbStatus: 'operational' | 'degraded' | 'down' = 'down';
    let dbLatencyMs = 0;
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - start;
      dbStatus = dbLatencyMs < 500 ? 'operational' : 'degraded';
    } catch {
      dbStatus = 'down';
    }

    // Mock statuses for external services (real checks deferred to production)
    const services = [
      {
        name: 'Database (PostgreSQL)',
        status: dbStatus,
        latencyMs: dbLatencyMs,
        description: 'Primary Railway PostgreSQL instance',
      },
      {
        name: 'Email (SMTP)',
        status: process.env.SMTP_HOST ? 'operational' : 'not configured',
        latencyMs: null,
        description: 'Nodemailer SMTP transport',
      },
      {
        name: 'SMS (Twilio)',
        status: process.env.TWILIO_ACCOUNT_SID ? 'operational' : 'not configured',
        latencyMs: null,
        description: 'Twilio REST API',
      },
      {
        name: 'Drug Interaction API',
        status: process.env.DRUGBANK_API_KEY ? 'operational' : 'using local fallback',
        latencyMs: null,
        description: 'DrugBank / local 20-pair fallback table',
      },
    ];

    const allOperational = services.every(
      (s) => s.status === 'operational' || s.status === 'not configured' || s.status === 'using local fallback'
    );

    return Response.json({
      overallStatus: allOperational ? 'healthy' : 'degraded',
      checkedAt: new Date().toISOString(),
      services,
    });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
