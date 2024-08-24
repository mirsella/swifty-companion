import { GenericOAuth2 } from "@capacitor-community/generic-oauth2";
import { Capacitor, CapacitorHttp } from "@capacitor/core";

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
    console.log("getToken grant_type", grant_type);
    const req_data = {
      grant_type,
      code,
      client_id: runtimeConfig.public.CLIENT_ID,
      client_secret: runtimeConfig.public.CLIENT_SECRET,
      // @ts-ignore: getPlatform always returns android or web
      redirect_uri: oauth2Options[Capacitor.getPlatform()].redirectUrl,
    };
    const response = await window.fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req_data),
    });
    if (response.status !== 200) {
      throw new Error(
        `response status ${response.status}, data ${await response.text()}`,
      );
    }
    const data = await response.json();
    console.log("getToken data", data);
    localStorage.token = data.access_token;
    const date = new Date();
    date.setSeconds(date.getSeconds() + data.expires_in);
    localStorage.tokenExpiryDate = date;
    localStorage.refreshToken = data.refresh_token;
  }

  async function refreshTokenIfNeeded() {
    let tokenExpiry = new Date(localStorage.tokenExpiryDate);
    if (tokenExpiry <= new Date()) {
      console.log("Token expired, refreshing");
      await getToken(localStorage.refreshToken, "refresh_token");
    }
  }

  async function getLoginData(login: string): Promise<UserApiResponse | null> {
    refreshTokenIfNeeded();
    const response = await window.fetch(
      `https://api.intra.42.fr/v2/users/${login}`,
      {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        console.log("getLoginData login not found");
        return null;
      }
      if (response.status === 401) {
        console.log(
          `api returned 401, reloading oauth: ${await response.text()}`,
        );
        await refreshTokenIfNeeded();
        return getLoginData(login);
      }
      throw new Error(
        `response status ${response.status}, data ${await response.text()}`,
      );
    }
    console.log("getLoginData", response);
    return await response.json();
  }

  async function signout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiryDate");
    reloadNuxtApp({ force: true });
  }

  // auto login
  try {
    if (!localStorage.token) {
      console.log("No token, starting oauth");
      await GenericOAuth2.authenticate(oauth2Options).then(async (res) => {
        console.log("oauth authenticate", JSON.stringify(res));
        const code = res.authorization_response.code;
        if (!code) {
          throw new Error(
            "Authorization process did not return a code: " +
              JSON.stringify(res),
          );
        }
        console.log("Got auth code", code);
        await getToken(code, "authorization_code");
      });
    }
    await refreshTokenIfNeeded();
  } catch (error: any) {
    console.error("Authentication error:", error);
    showError("Authentication error: " + error);
  }

  if (localStorage.token) {
    console.log("42 plugin loaded and authenticated");
  } else {
    showError("42 plugin loaded but not authenticated");
  }

  return {
    provide: {
      signout,
      getLoginData,
    },
  };
});
