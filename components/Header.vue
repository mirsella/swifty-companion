<script setup lang="ts"></script>
<template>
  <div class="navbar bg-base-100 justify-around">
    <div class="navbar-start">
      <NuxtLink
        v-if="$route.name !== 'index'"
        to="/"
        class="size-6 mx-4 i-carbon-home"
      >
        Swifty Companion
      </NuxtLink>
    </div>
    <div class="navbar-center">
      <NuxtLink to="/" class="font-bold"> Swifty Companion </NuxtLink>
    </div>
    <div class="navbar-end">
      <button class="btn btn-error btn-sm" @click="$signout()">signout</button>
    </div>
  </div>
</template>
