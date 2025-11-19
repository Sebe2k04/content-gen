import {
  AxiosAdapter,
  AxiosError,
  AxiosResponse,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

export const isNetworkError = (error: any): boolean => {
  if (!error) return false;

  const patterns = [
    "ERR_NETWORK",
    "ERR_CONNECTION_REFUSED",
    "ERR_INTERNET_DISCONNECTED",
    "ERR_NETWORK_CHANGED",
    "Failed to fetch",
    "Network Error",
    "ECONNABORTED",
    "ETIMEDOUT",
    "net::ERR",
  ];

  if (error.code && patterns.some((p) => error.code.includes(p))) return true;
  if (error.message && patterns.some((p) => error.message.includes(p)))
    return true;
  if (isAxiosError(error) && !error.response) return true;

  return false;
};

// ------------------------
// Offline Queue
// ------------------------
class LogQueue {
  private queue: any[] = [];
  private retryInterval = 5000;
  private maxRetries = 3;
  private isProcessing = false;
  private key = "network_logs";

  constructor(private sendFn: (payload: any) => Promise<boolean>) {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.process());
      this.load();
    }
  }

  private load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return;

    try {
      this.queue = JSON.parse(raw);
    } catch {
      localStorage.removeItem(this.key);
    }
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this.queue));
  }

  add(log: any) {
    this.queue.push({
      log,
      attempts: 0,
    });

    this.save();
    if (navigator.onLine) this.process();
  }

  async process() {
    if (this.isProcessing || !this.queue.length) return;

    this.isProcessing = true;

    for (const entry of [...this.queue]) {
      if (entry.attempts >= this.maxRetries) continue;

      entry.attempts++;
      const ok = await this.sendFn(entry.log);

      if (ok) {
        this.queue = this.queue.filter((e) => e !== entry);
        this.save();
      }
    }

    this.isProcessing = false;

    if (this.queue.length && navigator.onLine) {
      setTimeout(() => this.process(), this.retryInterval);
    }
  }

  stats() {
    return {
      queued: this.queue.length,
      online: navigator.onLine,
    };
  }
}

// ------------------------
// Payload Builder
// ------------------------

const convertHeaders = (h: AxiosResponseHeaders): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.keys(h).forEach((k) => {
    const v = h[k];
    if (v !== undefined) out[k.toLowerCase()] = Array.isArray(v) ? v.join(", ") : v;
  });
  return out;
};

const buildPayload = (req: any, res: any | null) => ({
  ts: Date.now(),
  request: {
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.data,
  },
  response: res
    ? {
        status: res.status,
        headers: convertHeaders(res.headers),
        body: res.data,
      }
    : null,
});

// ------------------------
// Logger Factory
// ------------------------

export const createNetworkLogger = ({
  projectId,
  disableLogs,
}: {
  projectId: string;
  disableLogs?: boolean;
}) => {
  const send = async (payload: any): Promise<boolean> => {
    if (disableLogs) return false;

    try {
      return true;
    } catch {
      return false;
    }
  };

  const queue = new LogQueue(send);

  // ------------------------
  // Main Axios Wrapper
  // ------------------------
  const withLogAxios = async (
    axios: AxiosAdapter,
    config: InternalAxiosRequestConfig
  ) => {
    if (disableLogs) return axios(config);

    try {
      const response = await axios(config);

      queue.add(
        buildPayload(
          {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
          },
          response
        )
      );

      return response;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      // NETWORK ERROR
      if (isNetworkError(error)) {
        queue.add(
          buildPayload(
            {
              url: config.url,
              method: config.method,
              headers: config.headers,
              data: config.data,
            },
            null
          )
        );
      }

      // API ERROR
      else {
        queue.add(
          buildPayload(
            {
              url: config.url,
              method: config.method,
              headers: config.headers,
              data: config.data,
            },
            axiosError?.response ?? null
          )
        );
      }

      throw error;
    }
  };

  const createLogAxiosFn = (axios: AxiosAdapter) =>
    withLogAxios.bind(null, axios);

  return {
    createLogAxiosFn,
    getQueueStats: () => queue.stats(),
  };
};
