
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export const useDirectoryDialog = () => {
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [outputDirectory, setOutputDirectory] = useState<string>('');

  // Load directory from localStorage on mount
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setOutputDirectory(savedDirectory);
  }, []);

  // Function to open directory settings dialog
  const handleOpenDirectorySettings = () => {
    setShowDirectoryDialog(true);
  };

  // Function to save directory settings
  const handleSaveDirectorySettings = () => {
    localStorage.setItem('cnab240OutputDirectory', outputDirectory);
    setShowDirectoryDialog(false);
    toast.success("Configurações de diretório salvas com sucesso!");
  };

  return {
    showDirectoryDialog,
    setShowDirectoryDialog,
    outputDirectory,
    setOutputDirectory,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings
  };
};
