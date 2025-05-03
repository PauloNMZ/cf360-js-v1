import { useState, useEffect } from 'react';

export const useDirectoryDialog = () => {
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [outputDirectory, setOutputDirectory] = useState<string>('');

  // Initialize with saved settings
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setOutputDirectory(savedDirectory);
  }, []);

  // Handle opening directory settings dialog
  const handleOpenDirectorySettings = () => {
    setShowDirectoryDialog(true);
  };

  // Handle saving directory settings
  const handleSaveDirectorySettings = (directory: string) => {
    setOutputDirectory(directory);
    localStorage.setItem('cnab240OutputDirectory', directory);
    setShowDirectoryDialog(false);
  };

  // Export the component's state and functions
  return {
    showDirectoryDialog,
    setShowDirectoryDialog,
    outputDirectory,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
  };
};
