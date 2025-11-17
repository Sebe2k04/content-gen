const publicRuntimeConfig =
  require("next/config").default().env;

const {
  apiUrl,
  frontendUrl,
  env,
} = publicRuntimeConfig;

export const getApiUrl = () => {
  return apiUrl;
};

export const getEnv = () => {
  return env;
};

export const getFrontendUrl = () => {
  return frontendUrl;
};
