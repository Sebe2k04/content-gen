import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "contract";
import axios, {
  type AxiosError,
  type AxiosResponse,
  isAxiosError,
  type AxiosRequestConfig,
  isCancel,
  CanceledError,
} from "axios";
import Cookies from "js-cookie";
import { getApiUrl } from "./env";
import { logout, userTokenCookieName } from "./common";
import { createNetworkLogger } from "./logger";

const { createLogAxiosFn } = createNetworkLogger({
  projectId: "test",
  disableLogs: false,
});
const withLogAxios = createLogAxiosFn(axios as any);

// Add global axios interceptors to catch network errors
axios.interceptors.request.use(
  (config) => config,
  (error) => {
    // This will catch errors during request setup
    return Promise.reject(error);
  }
);

// Add a response interceptor to catch network errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a network error (no response received)
    if (!error.response) {
      // logNetworkError(
      //   error,
      //   error.config?.url,
      //   error.config?.method,
      //   error.config?.data
      // );
    }
    return Promise.reject(error);
  }
);

const queryClient = (
  authToken: string | undefined,
  config?: AxiosRequestConfig<any>
) =>
  initQueryClient(contract, {
    baseUrl: getApiUrl(),
    baseHeaders: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    api: async ({ path, method, headers, body }) => {
      try {
        const result = await withLogAxios({
          method: method,
          url: path,
          headers: headers as any,
          data: body,
          ...config,
        });

        if (result.status === 401) {
          logout(true);
        }
        return {
          status: result.status,
          body: result.data,
          headers: result.headers as any,
        };
      } catch (e: Error | AxiosError | any) {
        if (
          isCancel(e) &&
          e instanceof CanceledError &&
          e.config?.signal instanceof AbortSignal
        ) {
          throw new Error(e.config?.signal?.reason ?? "Request Cancelled");
        }

        if (isAxiosError(e)) {
          const error = e as AxiosError;

          // If there's no response, it's likely a network error
          if (!error.response) {
            // logNetworkError(error, path, method, body);
            throw error;
          }

          const response = error.response as AxiosResponse;
          return {
            status: response.status,
            body: response.data,
            headers: response.headers,
          };
        }

        // For non-Axios errors that might be network related
        // logNetworkError(e, path, method, body);
        throw e;
      }
    },
  });

export const getQueryClient = (config?: AxiosRequestConfig<any>) => {
  const authToken = Cookies.get(userTokenCookieName);
  return queryClient(authToken, config);
};
