/**
 * Validates a Thai National ID using the Modulo 11 checksum algorithm
 * @param id The 13-digit Thai National ID string
 * @returns boolean indicating if the ID is valid
 */
export function validateThaiId(id: string): boolean {
  // 1. Check if the length is exactly 13 digits
  if (id.length !== 13) return false;

  // 2. Check if all characters are digits
  if (!/^\d+$/.test(id)) return false;

  // 3. Modulo 11 Checksum Algorithm
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }

  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(id.charAt(12));
}

/**
 * Sanitizes the Thai National ID by removing non-digit characters
 * @param id Raw ID string
 * @returns Cleaned 13-digit string
 */
export function sanitizeThaiId(id: string): string {
  return id.replace(/\D/g, "");
}
