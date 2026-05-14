import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireRole, toAuthErrorResponse, hashPassword, verifyPin } from '@/lib/auth';
import { logAdminEvent, AuditEvent } from '@/lib/audit';

// ---------------------------------------------------------------------------
// POST /api/professional/pin
//
// Allows a professional to set or change their 6-digit PIN.
// If a PIN is already set, they must provide the correct currentPin to change it.
// ---------------------------------------------------------------------------

const pinSchema = z.object({
  currentPin: z.string().nullable().optional(),
  newPin: z.string().length(6, 'PIN must be exactly 6 digits.').regex(/^\d+$/, 'PIN must contain only numbers.'),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await requireRole(req, 'PROFESSIONAL');
    const body = await req.json();
    
    const parsed = pinSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { currentPin, newPin } = parsed.data;

    // Fetch the professional profile
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return Response.json({ error: 'Professional profile not found.' }, { status: 404 });
    }

    // If a PIN is already set, we must verify the current PIN
    if (profile.pin) {
      if (!currentPin) {
        return Response.json({ error: 'Current PIN is required to change your PIN.' }, { status: 400 });
      }

      const isCurrentPinValid = await verifyPin(currentPin, profile.pin);
      if (!isCurrentPinValid) {
        return Response.json({ error: 'Incorrect current PIN.' }, { status: 401 });
      }
    }

    // Hash the new PIN
    const hashedNewPin = await hashPassword(newPin);

    // Update the profile
    await prisma.professionalProfile.update({
      where: { id: profile.id },
      data: {
        pin: hashedNewPin,
        pinFailCount: 0, // Reset fail count on successful PIN change
      },
    });

    // Log the event securely
    await logAdminEvent(
      AuditEvent.PIN_CHANGED,
      session.user.id,
      session.user.id,
      { prcNumber: profile.prcNumber }
    );

    return Response.json({ success: true, message: 'PIN updated successfully.' });
  } catch (err) {
    return toAuthErrorResponse(err);
  }
}
