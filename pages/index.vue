<script setup lang="ts">
const login = ref("");
async function search() {
  await navigateTo(login.value || "lgillard");
}
</script>

<template>
  <div class="m-10 space-y-4">
    <p class="text-lg text-center w-full text-error">
      {{ $route.query.error }}
    </p>
    <input
      v-model="login"
      class="input input-primary w-full"
      placeholder="login (default: lgillard)"
      @keyup.enter="search()"
    />
    <button class="btn btn-primary w-full" @click="search()">search</button>
  </div>
</template>
