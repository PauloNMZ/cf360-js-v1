
import React, { useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface WorkflowEventHandlerProps {
  onOpenDirectorySettings: () => void;
}

const WorkflowEventHandler: React.FC<WorkflowEventHandlerProps> = ({
  onOpenDirectorySettings
}) => {
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const handleOpenSettings = () => {
      try {
        onOpenDirectorySettings();
      } catch (error) {
        handleError(error, {
          component: 'WorkflowEventHandler',
          file: 'WorkflowEventHandler.tsx',
          action: 'handleOpenSettings'
        });
      }
    };

    document.addEventListener('openDirectorySettings', handleOpenSettings);
    
    return () => {
      document.removeEventListener('openDirectorySettings', handleOpenSettings);
    };
  }, [onOpenDirectorySettings, handleError]);

  return null; // This component doesn't render anything
};

export default WorkflowEventHandler;
