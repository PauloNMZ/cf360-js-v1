
import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/services/storage';

export const useDirectoryDialog = () => {
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [outputDirectory, setOutputDirectory] = useState<string>('');

  // Initialize with saved settings
  useEffect(() => {
    const savedDirectory = localStorage.getItem(STORAGE_KEYS.CNAB240_OUTPUT_DIRECTORY) || '';
    setOutputDirectory(savedDirectory);
  }, []);

  // Handle opening directory settings dialog
  const handleOpenDirectorySettings = () => {
    setShowDirectoryDialog(true);
  };

  // Handle saving directory settings - updated to use the current state
  const handleSaveDirectorySettings = () => {
    localStorage.setItem(STORAGE_KEYS.CNAB240_OUTPUT_DIRECTORY, outputDirectory);
    setShowDirectoryDialog(false);
  };

  // Export the component's state and functions
  return {
    showDirectoryDialog,
    setShowDirectoryDialog,
    outputDirectory,
    setOutputDirectory,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
  };
};
