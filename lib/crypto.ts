import crypto from 'crypto';

// AES-256-CBC — key must be exactly 32 bytes (64 hex chars) set as ENCRYPTION_KEY in .env
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size

function getKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      'ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return Buffer.from(keyHex, 'hex');
}

/**
 * Encrypts a plaintext string using AES-256-CBC.
 * Returns a string in the format: `<ivHex>:<encryptedHex>`
 *
 * This function is used on all PHI fields before they are written to the database.
 */
export function encrypt(text: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypts a ciphertext string previously produced by `encrypt()`.
 * Input format: `<ivHex>:<encryptedHex>`
 *
 * Returns the original plaintext string.
 */
export function decrypt(encryptedText: string): string {
  const key = getKey();
  const [ivHex, encryptedHex] = encryptedText.split(':');
  if (!ivHex || !encryptedHex) {
    throw new Error(
      'Invalid encrypted text format. Expected "<ivHex>:<encryptedHex>".'
    );
  }
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8');
}

/**
 * Safely decrypts a nullable field.
 * Returns null if the input is null or undefined.
 */
export function decryptNullable(value: string | null | undefined): string | null {
  if (value == null) return null;
  return decrypt(value);
}

/**
 * Safely encrypts a nullable field.
 * Returns null if the input is null or undefined.
 */
export function encryptNullable(value: string | null | undefined): string | null {
  if (value == null) return null;
  return encrypt(value);
}
