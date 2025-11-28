export interface ToastOptions {
  id?: string;
  message: React.ReactNode;
  status?: ToastStatus;
  duration?: number;
  [key: string]: any; // Add index signature to allow additional properties
}
export enum ToastStatus {
  info = "info",
  warning = "warning",
  success = "success",
  error = "error",
}