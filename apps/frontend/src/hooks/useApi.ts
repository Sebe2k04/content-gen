import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";

import { useCustomToast } from "@/hooks/useToast";
import { logout } from "@/utils/common";
import { ToastStatus } from "@/types/toast";

// Your interface
export interface ErrorStatusInterface {
  message: string;
}

interface ApiResponse<T> {
  status: number;
  body: T;
}

export interface MakeApiCallFunctionProps<T> {
  fetcherFn: () => Promise<ApiResponse<T>>;
  onSuccessFn?: (response: T) => void;
  onFailureFn?: (error: AxiosError) => void;
  successMsg?: string;
  failureMsg?: string;
  showLoader?: boolean;
  showFailureMsg?: boolean;
  finallyFn?: () => void;
}

const successToastId = "success-id";
const errorToastId = "errorToast-id";

export function useApiQuery<T = any>() {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const { showToast } = useCustomToast();

const mutation = useMutation<ApiResponse<T>, AxiosError, MakeApiCallFunctionProps<T>>({
  mutationFn: async (variables: MakeApiCallFunctionProps<T>): Promise<ApiResponse<T>> => {
    const {
      fetcherFn,
      onSuccessFn,
      onFailureFn,
      successMsg,
      failureMsg,
      showLoader = true,
      showFailureMsg = true,
      finallyFn,
    } = variables;

    try {
      if (showLoader) setIsApiLoading(true);
      const response = await fetcherFn();

      // ... rest of your success handling ...

      if (response.status >= 200 && response.status <= 299) {
        if (successMsg) {
          showToast({
            id: successToastId,
            status: ToastStatus.success,
            message: successMsg,
          });
        }
        onSuccessFn?.(response.body);
        return response;
      }

      // ... rest of your error handling ...

      // If we get here, it's an error case
      const error = new Error(failureMsg || "Something went wrong") as AxiosError;
      throw error;

    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Handle 401 Unauthorized
      if (axiosError.response?.status === 401) {
        // Logout with unauthorized flag
        logout(true);
        // Don't show the error toast for unauthorized as we're redirecting to login
        throw axiosError;
      }
      
      if (showFailureMsg) {
        let errorMessage = failureMsg || "Something went wrong";
        
        if (axiosError.response?.data) {
          errorMessage = (axiosError.response.data as any)?.message || errorMessage;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
        
        showToast({
          id: errorToastId,
          status: ToastStatus.error,
          message: errorMessage,
        });
      }

      onFailureFn?.(axiosError);
      throw axiosError; // Re-throw the error to be handled by react-query
    } finally {
      setIsApiLoading(false);
      finallyFn?.();
    }
  },
});

  async function makeApiCall(
    props: MakeApiCallFunctionProps<T>,
  ) {
    return mutation.mutateAsync(props);
  }

  return { makeApiCall, isApiLoading };
}
