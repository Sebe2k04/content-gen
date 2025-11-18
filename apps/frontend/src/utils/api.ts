import { initQueryClient } from "@ts-rest/react-query";
import { contract } from "contract";
import Cookies from "js-cookie";
import { tsRestFetcher } from "./tsRestFetcher";
import { userTokenCookieName } from "./common";
import { getApiUrl } from "./env";

export const getQueryClient = (config?: any) => {
  const token = Cookies.get(userTokenCookieName);

  return initQueryClient(contract, {
    baseUrl:"",
    baseHeaders: {},
    api: tsRestFetcher(token, config),
  });
};
