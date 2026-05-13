import QRCode from 'qrcode';

// ---------------------------------------------------------------------------
// QR Code Generator
//
// Converts the patient's unique UUID into a full URL (https://lunas.app/scan/{uuid})
// and renders it as a base64-encoded PNG image for frontend display or download.
// ---------------------------------------------------------------------------

/**
 * Generates a QR code image as a base64 Data URL.
 *
 * @param uuid - The patient's permanent QR UUID (from PatientProfile.qrUuid)
 * @returns    - A promise that resolves to a string: "data:image/png;base64,..."
 */
export async function generateQrImage(uuid: string): Promise<string> {
  // Use the public app URL from environment, fallback to localhost for dev if missing
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // The URL embedded in the QR code
  const scanUrl = `${baseUrl}/scan/${uuid}`;

  try {
    // Generate QR code with high error correction (H) so it remains scannable
    // even if partially obscured or printed poorly.
    const base64Png = await QRCode.toDataURL(scanUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',  // Black dots
        light: '#ffffff', // White background
      },
    });

    return base64Png;
  } catch (err) {
    console.error('[qr] Failed to generate QR code image:', err);
    throw new Error('Failed to generate QR code.');
  }
}
