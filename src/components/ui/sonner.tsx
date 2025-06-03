
import { useTheme } from "@/hooks/use-theme";

type ToasterProps = any;

const Toaster = ({ ...props }: ToasterProps) => {
  // Return null to disable Sonner toast notifications
  // All notifications now use the Modal Universal system
  return null;
};

export { Toaster };

// Disabled toast function - all notifications use Modal Universal
export const toast = {
  success: (message: string, options?: any) => {
    console.log("Sonner toast blocked - using Modal Universal instead:", message);
  },
  error: (message: string, options?: any) => {
    console.log("Sonner toast blocked - using Modal Universal instead:", message);
  },
  warning: (message: string, options?: any) => {
    console.log("Sonner toast blocked - using Modal Universal instead:", message);
  },
  info: (message: string, options?: any) => {
    console.log("Sonner toast blocked - using Modal Universal instead:", message);
  },
  promise: (promise: Promise<any>, options?: any) => {
    console.log("Sonner toast promise blocked - using Modal Universal instead");
    return promise;
  },
  dismiss: (id?: string) => {
    console.log("Sonner toast dismiss blocked - using Modal Universal instead");
  }
};
