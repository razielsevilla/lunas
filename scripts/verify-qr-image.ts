// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateQrImage } = require('../lib/qr');

async function main() {
  process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const dataUrl = await generateQrImage('test-uuid-1234');

  if (!dataUrl.startsWith('data:image/png;base64,')) {
    throw new Error('QR output is not a PNG data URL.');
  }

  const base64 = dataUrl.replace('data:image/png;base64,', '');
  const buffer = Buffer.from(base64, 'base64');
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  if (buffer.length < 8 || !buffer.subarray(0, 8).equals(pngSignature)) {
    throw new Error('QR output does not start with a valid PNG signature.');
  }

  console.log('QR image verification passed:', buffer.length, 'bytes');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});