import { useToastContext } from "@/context/ToastProvider";
import { ToastStatus } from "@/types/toast";



export function useCustomToast() {
  const context = useToastContext();
  return {
    showToast: context.showToast,
    ToastStatus,
  };
}
