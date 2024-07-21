<script setup lang="ts">
import { GenericOAuth2 } from "@capacitor-community/generic-oauth2";
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

const code = ref("");

async function getToken(): Promise<object> {
  const formData = new FormData();
  formData.append("grant_type", "authorization_code");
  formData.append("code", code.value);
  formData.append("client_id", runtimeConfig.public.CLIENT_ID);
  formData.append("client_secret", runtimeConfig.public.CLIENT_SECRET);
  formData.append("redirect_uri", "http://localhost:3000/callback");
  const res = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    body: formData,
  });
  return res.json();
}

async function login() {
  try {
    const res = await GenericOAuth2.authenticate(oauth2Options);
    const rescode = res.authorization_response.code;
    if (!rescode) {
      throw new Error(
        "authorization process didn't return a code: " + JSON.stringify(res),
      );
    }
    code.value = rescode;
  } catch (e) {
    console.error(e);
    showError("an error occured, couldn't finish the oauth process: " + e);
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <button class="btn btn-brimary" @click="login()">authoriation</button>
    <button class="btn btn-brimary" @click="getToken()">get token</button>
    {{ code }}
  </div>
</template>
