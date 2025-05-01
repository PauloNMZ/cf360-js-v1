
import React from 'react';

/**
 * Utility functions to calculate and manage viewport space
 */

/**
 * Calculates the available content height for the main section
 * taking into account fixed elements like header and footer
 * 
 * @param headerHeight - The height of the fixed header in pixels
 * @param footerHeight - The height of the fixed footer in pixels
 * @param heightReduction - Optional reduction of height (to make content area smaller)
 * @returns The available height for content in pixels
 */
export const calculateAvailableContentHeight = (
  headerHeight: number = 80, // Default header height
  footerHeight: number = 60,  // Default footer height
  heightReduction: number = 0 // Default no reduction
): number => {
  // Get the total viewport height
  const viewportHeight = window.innerHeight;
  
  // Calculate the available content height with optional reduction
  const availableHeight = viewportHeight - (headerHeight + footerHeight + heightReduction);
  
  return availableHeight;
};

/**
 * React hook that returns the available content height and updates on window resize
 * 
 * @param headerHeight - The height of the fixed header in pixels
 * @param footerHeight - The height of the fixed footer in pixels
 * @param heightReduction - Optional reduction of height (to make content area smaller)
 * @returns The available height for content in pixels
 */
export const useAvailableContentHeight = (
  headerHeight: number = 80,
  footerHeight: number = 60,
  heightReduction: number = 0
): number => {
  const [availableHeight, setAvailableHeight] = React.useState(
    calculateAvailableContentHeight(headerHeight, footerHeight, heightReduction)
  );
  
  React.useEffect(() => {
    const handleResize = () => {
      setAvailableHeight(calculateAvailableContentHeight(headerHeight, footerHeight, heightReduction));
    };
    
    // Set initial height
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [headerHeight, footerHeight, heightReduction]);
  
  return availableHeight;
};

/**
 * Creates a style object for a content container that should fill the available space without scrolling
 * 
 * @param headerHeight - The height of the fixed header in pixels
 * @param footerHeight - The height of the fixed footer in pixels
 * @param extraPadding - Additional padding to subtract from the height (e.g., for margins)
 * @param heightReduction - Optional reduction percentage (0-100) to make content area smaller
 * @returns CSS properties object for the content container
 */
export const getContentContainerStyle = (
  headerHeight: number = 80,
  footerHeight: number = 60,
  extraPadding: number = 0,
  heightReduction: number = 0
): React.CSSProperties => {
  // Calculate the height reduction in pixels
  const totalHeight = `calc(100vh - ${headerHeight + footerHeight + extraPadding + heightReduction}px)`;
  
  return {
    height: totalHeight,
    maxHeight: totalHeight,
    overflow: 'auto'
  };
};
