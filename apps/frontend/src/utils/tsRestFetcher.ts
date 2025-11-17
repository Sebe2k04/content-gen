import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
  isCancel,
  CanceledError,
} from "axios";

import Cookies from "js-cookie";
import { userTokenCookieName, logout } from "@/utils/common";
import { getApiUrl } from "./env";

/**
 * Creates an Axios instance with request/response logging
 */
const createLogAxiosFn = (axiosInstance: AxiosInstance): AxiosInstance => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(`[${config.method?.toUpperCase()}] ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(`[${response.status}] ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      if (error.response) {
        console.error(
          `[${error.response.status}] ${error.config?.url}:`,
          error.response.data
        );
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

const axiosWithLogs = createLogAxiosFn(axios);

// GLOBAL INTERCEPTORS
axios.interceptors.request.use(
  (config) => config,
  (error) => {
    // logNetworkError(
    //   error,
    //   error.config?.url,
    //   error.config?.method,
    //   error.config?.data
    // );
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
    //   logNetworkError(
    //     error,
    //     error.config?.url,
    //     error.config?.method,
    //     error.config?.data
    //   );
    }
    return Promise.reject(error);
  }
);

export const tsRestFetcher = (token?: string, config?: AxiosRequestConfig) => {
  return async ({ path, method, headers, body }: any) => {
    try {
      const result = await axiosWithLogs({
        url: `${getApiUrl()}${path}`,
        method,
        data: body,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        ...config,
      });

      if (result.status === 401) {
        Cookies.remove(userTokenCookieName);
        logout(true);
      }

      return {
        status: result.status,
        body: result.data,
        headers: result.headers as any,
      };
    } catch (e: any) {
      if (
        isCancel(e) &&
        e instanceof CanceledError &&
        e.config?.signal instanceof AbortSignal
      ) {
        throw new Error(e.config?.signal?.reason ?? "Request Cancelled");
      }

      if (isAxiosError(e)) {
        const err = e as AxiosError;

        if (!err.response) {
        //   logNetworkError(err, path, method, body);
          throw err;
        }

        const response = err.response as AxiosResponse;

        return {
          status: response.status,
          body: response.data,
          headers: response.headers as any,
        };
      }

    //   logNetworkError(e, path, method, body);
      throw e;
    }
  };
};
