
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, File, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  onRemove?: (file: File) => void;
  disabled?: boolean;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  showDropZone?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept = 'image/*,application/pdf', 
  maxSize = 5, // 5MB 
  maxFiles = 1,
  onChange,
  onRemove,
  disabled = false,
  onDrop,
  showDropZone = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = e.target.files;
    processFiles(selectedFiles);
  };
  
  const processFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Check if max files limit is reached
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Você pode anexar no máximo ${maxFiles} arquivo${maxFiles !== 1 ? 's' : ''}.`);
      return;
    }
    
    setLoading(true);
    
    const newFiles: File[] = [];
    const errors: string[] = [];
    
    Array.from(selectedFiles).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`O arquivo "${file.name}" excede o tamanho máximo de ${maxSize}MB.`);
        return;
      }
      
      newFiles.push(file);
    });
    
    if (errors.length > 0) {
      setError(errors[0]);
      setLoading(false);
      return;
    }
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    if (onChange) {
      onChange(updatedFiles);
    }
    
    // Clear input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    setLoading(false);
    
    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} arquivo${newFiles.length !== 1 ? 's' : ''} anexado${newFiles.length !== 1 ? 's' : ''} com sucesso.`);
    }
  };
  
  const handleRemove = (index: number) => {
    const removedFile = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    if (onRemove) {
      onRemove(removedFile);
    }
    
    if (onChange) {
      onChange(newFiles);
    }
    
    toast.info(`Arquivo "${removedFile.name}" removido.`);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDropCustom = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (onDrop) {
      onDrop(e);
    } else {
      const droppedFiles = e.dataTransfer.files;
      processFiles(droppedFiles);
    }
  };
  
  return (
    <div className="space-y-4">
      {showDropZone ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDropCustom}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-10 w-10 text-blue-500" />
            <p className="text-base font-medium">
              Arraste e solte seu arquivo aqui, ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Formatos aceitos: {accept.split(',').join(', ')}. Tamanho máximo: {maxSize}MB
            </p>
          </div>
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              disabled={disabled || loading || files.length >= maxFiles}
              className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {files.length >= maxFiles ? 'Limite atingido' : 'Anexar arquivo'}
            </Button>
            <input
              type="file"
              ref={inputRef}
              accept={accept}
              multiple={maxFiles > 1}
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: {accept.split(',').join(', ')}. Tamanho máximo: {maxSize}MB.
          </p>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}
      
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-md border bg-gray-50">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
