import { initContract } from "@ts-rest/core";
import { authContract } from "./auth/contract";
import { userContract } from "./user/contract";
import { portfolioContract } from "./portfolio/contract";
import { uploadContract } from "./upload/contract";
const c = initContract();
export const contract = c.router({
  auth: authContract,
  user: userContract,
  portfolio: portfolioContract,
  upload: uploadContract,
});
