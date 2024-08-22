<script setup lang="ts">
const { $getLoginData } = useNuxtApp();
const login = ref("");
const data = ref({});
async function search() {
  try {
    data.value = await $getLoginData(login.value || "lgillard");
  } catch (error) {
    console.error(error);
    showError("erreur lors de la recherche: " + error);
  }
}
</script>

<template>
  <div>
    <div class="space-x-4">
      <input
        v-model="login"
        type="text"
        class="input input-primary"
        placeholder="login (default: lgillard)"
      />
      <button class="btn btn-primary" @click="search()">search</button>
    </div>
    {{ data }}
  </div>
</template>
