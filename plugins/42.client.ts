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
      mode: "no-cors",
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("getToken", data);
    localStorage.token = data.access_token;
    localStorage.tokenExpiry = data.secret_valid_until;
    localStorage.refreshToken = data.refresh_token;
  }

  async function refreshTokenIfNeeded() {
    let tokenExpiry = new Date(localStorage.tokenExpiry || 0 * 1000);
    if (tokenExpiry < new Date()) {
      console.log("Token expired, refreshing");
      await getToken(localStorage.refreshToken || "", "refresh_token");
    }
  }

  try {
    let token = localStorage.token;
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
    await refreshTokenIfNeeded();
  } catch (error) {
    console.error("Authentication error:", error);
  }
  console.log("42 plugin loaded and authenticated");

  async function getLoginData(login: string): Promise<object> {
    refreshTokenIfNeeded();
    const res = await fetch(`https://api.intra.42.fr/v2/users/${login}`, {
      mode: "no-cors",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then((e) => e.json());
    console.log(res);
    return res;
  }

  async function signout() {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    reloadNuxtApp();
  }

  return {
    provide: {
      signout,
      getLoginData,
    },
  };
});
