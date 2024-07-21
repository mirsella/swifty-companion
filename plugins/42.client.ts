import { GenericOAuth2 } from "@capacitor-community/generic-oauth2";

export default defineNuxtPlugin(async (nuxtApp) => {
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

  // grant_type can be "authorization_code" or "refresh_token"
  async function getToken(code: string, grant_type: string) {
    console.log("getToken", grant_type);
    const formData = new FormData();
    formData.append("grant_type", grant_type);
    formData.append("code", code);
    formData.append("client_id", runtimeConfig.public.CLIENT_ID);
    formData.append("client_secret", runtimeConfig.public.CLIENT_SECRET);
    formData.append("redirect_uri", oauth2Options.web.redirectUrl);
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("getToken", data);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("tokenExpiry", data.secret_valid_until);
    localStorage.setItem("refreshToken", data.refresh_token);
  }

  try {
    let token = localStorage.getItem("token");
    if (!token) {
      console.log("No token, starting oauth");
      await GenericOAuth2.authenticate(oauth2Options)
        .then(async (res) => {
          const code = res.authorization_response.code;
          if (!code) {
            throw new Error(
              "Authorization process did not return a code: " +
                JSON.stringify(res),
            );
          }
          console.log("Got auth code", code);
          await getToken(code, "authorization_code");
        })
        .catch((e) => showError(e));
    }
    let tokenExpiry = new Date(localStorage.getItem("tokenExpiry") || 0 * 1000);
    if (tokenExpiry < new Date()) {
      console.log("Token expired, refreshing");
      await getToken(
        localStorage.getItem("refreshToken") || "",
        "refresh_token",
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
  console.log("42 plugin loaded and authenticated");

  async function getLoginData(login: string): Promise<object> {
    // TODO: implement
    return {};
  }
  async function signout() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    reloadNuxtApp();
  }

  nuxtApp.provide("getLoginData", getLoginData);
  nuxtApp.provide("signout", signout);
  // use the return {} method of providing hepler
});
