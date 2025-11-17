import { initContract } from "@ts-rest/core";
import { authContract } from "./auth/contract";
import { userContract } from "./user/contract";
const c = initContract();
export const contract = c.router({
  auth: authContract,
  user: userContract,
});
