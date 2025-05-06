
import { useRef } from "react";

export interface CursorState {
  selectionStart: number;
  value: string;
}

/**
 * Hook to manage cursor position in formatted input fields
 */
export const useCursorPosition = () => {
  const cursorStateRef = useRef<CursorState | null>(null);
  
  /**
   * Calculates the new cursor position after formatting
   */
  const calculateNewCursorPosition = (
    input: HTMLInputElement,
    previousState: CursorState,
    currentValue: string
  ) => {
    // Count digits before cursor position in the previous value
    const valueBeforeCursor = previousState.value.substring(0, previousState.selectionStart);
    const digitsBeforeCursor = (valueBeforeCursor.replace(/\D/g, '')).length;
    
    // Find the position after the Nth digit in the new value
    let digitCount = 0;
    let newPosition = 0;
    
    for (let i = 0; i < currentValue.length && digitCount <= digitsBeforeCursor; i++) {
      if (/\d/.test(currentValue[i])) {
        digitCount++;
      }
      if (digitCount <= digitsBeforeCursor) {
        newPosition = i + 1;
      }
    }
    
    return Math.min(Math.max(0, newPosition), currentValue.length);
  };
  
  /**
   * Saves the current cursor state before a change
   */
  const saveCursorState = (input: HTMLInputElement) => {
    if (input) {
      cursorStateRef.current = {
        selectionStart: input.selectionStart || 0,
        value: input.value
      };
    }
  };
  
  /**
   * Restores the cursor position after formatting
   */
  const restoreCursorPosition = (input: HTMLInputElement) => {
    if (input && cursorStateRef.current && document.activeElement === input) {
      const newPosition = calculateNewCursorPosition(
        input, 
        cursorStateRef.current,
        input.value
      );
      
      // Only set if the element is still focused
      input.setSelectionRange(newPosition, newPosition);
    }
  };
  
  return {
    saveCursorState,
    restoreCursorPosition
  };
};
