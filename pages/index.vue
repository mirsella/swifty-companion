<script setup lang="ts">
const { $signout, $getLoginData } = useNuxtApp();
const login = ref("lgillard");
const data = ref({});
async function search() {
  try {
    data.value = await $getLoginData(login.value);
  } catch (error) {
    console.error(error);
    showError("erreur lors de la recherche: " + error);
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-8">
    <button class="btn btn-primary btn-wide" @click="$signout()">
      signout
    </button>
    <div class="space-x-4">
      <input
        v-model="login"
        type="text"
        class="input input-primary"
        placeholder="login"
      />
      <button class="btn btn-primary" @click="search()">search</button>
    </div>
    {{ data }}
  </div>
</template>
