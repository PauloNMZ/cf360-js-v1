
import { STORAGE_KEYS } from '@/services/storage';

/**
 * Get the next sequence number for remittance files
 * @returns A two-digit string representing the next sequence number (01-99)
 */
export const getNextSequenceNumber = (): string => {
  // Get current sequence from localStorage
  const currentSequence = localStorage.getItem(STORAGE_KEYS.REMESSA_SEQUENCE);
  
  // Parse the sequence number or start from 0 if not found
  let sequenceNumber = currentSequence ? parseInt(currentSequence, 10) : 0;
  
  // Increment the sequence number
  sequenceNumber = (sequenceNumber % 99) + 1;
  
  // Store the new sequence number
  localStorage.setItem(STORAGE_KEYS.REMESSA_SEQUENCE, sequenceNumber.toString());
  
  // Return formatted sequence number as a two-digit string
  return sequenceNumber.toString().padStart(2, '0');
};

/**
 * Reset the sequence number to zero
 */
export const resetSequenceNumber = (): void => {
  localStorage.setItem(STORAGE_KEYS.REMESSA_SEQUENCE, '0');
};
