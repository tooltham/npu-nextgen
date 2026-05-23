import crypto from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

/**
 * Encrypts a string using AES-256-GCM
 * @param text The plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:ciphertext (hex)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex");
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string using AES-256-GCM
 * @param encryptedText The encrypted string in format: iv:authTag:ciphertext (hex)
 * @returns The original plain text
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");

  if (parts.length !== 3) {
    // Fallback: check if it's base64 encoded (used in dummy seed data)
    try {
      const decoded = Buffer.from(encryptedText, "base64").toString("utf8");
      if (/^111111111111\d$/.test(decoded)) {
        return decoded;
      }
    } catch {
      // ignore
    }
    throw new Error("Invalid encrypted text format");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  try {
    let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    throw new Error(
      "Decryption failed. Data might be corrupted or key is incorrect.",
    );
  }
}
