<script setup lang="ts">
const { $signout } = useNuxtApp();
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <button class="btn btn-primary" @click="$signout()">signout</button>
  </div>
</template>
