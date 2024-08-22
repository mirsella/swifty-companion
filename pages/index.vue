<script setup lang="ts">
const { $getLoginData } = useNuxtApp();
const login = ref("");
const error = ref("");
const loading = ref(false);
async function search() {
  loading.value = true;
  error.value = "";
  // NOTE: we can do a expensive fetch because it will be cached by the browser
  try {
    const user = await $getLoginData(login.value || "lgillard");
    if (user) {
      await navigateTo(user.login);
      loading.value = false;
    } else {
      loading.value = false;
      error.value = "login not found: " + login.value;
    }
  } catch (error) {
    loading.value = false;
    showError("erreur lors de la recherche: " + error);
  }
}
</script>

<template>
  <div class="m-10 space-y-4">
    <p class="text-lg text-center w-full text-error">{{ error }}</p>
    <input
      v-model="login"
      class="input input-primary w-full"
      placeholder="login (default: lgillard)"
      @keyup.enter="search()"
    />
    <button class="btn btn-primary w-full" @click="search()">
      <span v-if="loading" class="loading loading-lg loading-infinity"></span>
      search
    </button>
  </div>
</template>
