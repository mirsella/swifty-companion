import { GenericOAuth2 } from "@capacitor-community/generic-oauth2";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  const oauth2Options = {
    authorizationBaseUrl: "https://api.intra.42.fr/oauth/authorize",
    additionalParameters: {
      client_secret: runtimeConfig.public.CLIENT_SECRET,
    },
    web: {
      appId: runtimeConfig.public.CLIENT_ID,
      responseType: "code",
      redirectUrl: "http://localhost:3000/callback",
    },
    android: {
      appId: runtimeConfig.public.CLIENT_ID,
      responseType: "code",
      redirectUrl: "swiftycompanion://callback",
    },
  };

  async function getToken(code) {
    const formData = new FormData();
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append("client_id", runtimeConfig.public.CLIENT_ID);
    formData.append("client_secret", runtimeConfig.public.CLIENT_SECRET);
    formData.append("redirect_uri", oauth2Options.web.redirectUrl);
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    return data;
  }

  async function refreshAccessToken(refreshToken) {
    const formData = new FormData();
    formData.append("grant_type", "refresh_token");
    formData.append("refresh_token", refreshToken);
    formData.append("client_id", runtimeConfig.public.CLIENT_ID);
    formData.append("client_secret", runtimeConfig.public.CLIENT_SECRET);
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    return data;
  }

  async function validateToken(accessToken) {
    try {
      const response = await fetch("https://api.intra.42.fr/oauth/validate", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Token validation failed");
      return true;
    } catch {
      return false;
    }
  }

  async function login() {
    try {
      let accessToken = localStorage.getItem("accessToken");
      if (accessToken && (await validateToken(accessToken))) {
        return accessToken;
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        return refreshAccessToken(refreshToken);
      }

      const res = await GenericOAuth2.authenticate(oauth2Options);
      if (!res.authorization_response || !res.authorization_response.code) {
        throw new Error(
          "Authorization process did not return a code: " + JSON.stringify(res),
        );
      }

      return getToken(res.authorization_response.code);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }

  nuxtApp.provide("login", login);
});
