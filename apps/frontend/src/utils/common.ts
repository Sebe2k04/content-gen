import Cookies from "js-cookie";

export const userTokenCookieName = "userToken";

export const logout = (isUnauthorised: boolean = false) => {
  if (Cookies.get(userTokenCookieName)) {
    Cookies.remove(userTokenCookieName);
  }
  window.location.href = "/login?ua=" + isUnauthorised;
};