<script setup lang="ts">
const login = ref("");
</script>

<template>
  <div class="m-10 space-y-4">
    <input
      v-model="login"
      class="input input-primary w-full"
      placeholder="login (default: lgillard)"
    />
    <button
      class="btn btn-primary w-full"
      @click="navigateTo(login || 'lgillard')"
    >
      search
    </button>
  </div>
</template>
