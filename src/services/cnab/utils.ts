
/**
 * Utility functions for CNAB file processing
 */

/**
 * Extract date from a line at given position
 */
export function extractDate(line: string, start: number, end: number): string {
  const dateStr = line.substring(start, end);
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4);
  return `${day}/${month}/${year}`;
}

/**
 * Extract time from a line at given position
 */
export function extractTime(line: string, start: number, end: number): string {
  const timeStr = line.substring(start, end);
  const hour = timeStr.substring(0, 2);
  const minute = timeStr.substring(2, 4);
  const second = timeStr.substring(4);
  return `${hour}:${minute}:${second}`;
}

/**
 * Format date string
 */
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '00000000') return '';
  const day = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  const year = dateStr.substring(4);
  return `${day}/${month}/${year}`;
}

/**
 * Generate a random ID
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
