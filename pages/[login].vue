<script setup lang="ts">
const { $getLoginData } = useNuxtApp();
const route = useRoute();
const data = ref<UserApiResponse>();
try {
  data.value = await $getLoginData(route.params.login as string);
} catch (error) {
  console.error(error);
  showError("erreur lors de la recherche: " + error);
}
const skills = computed(() => {
  let max_cursus: CursusUser = data.value?.cursus_users[0]!;
  for (const cursus of data.value?.cursus_users.slice(1)!) {
    if (cursus.skills.length > max_cursus.skills.length) {
      max_cursus = cursus;
    }
  }
  return max_cursus.skills;
});
</script>

<template>
  <div>
    <div class="card card-compact bg-base-100 shadow-xl m-4">
      <figure>
        <img class="rounded-lg" :src="data?.image.link" alt="avatar" />
      </figure>
      <div class="card-body">
        <span class="card-title"
          >{{ data?.displayname }} ({{ data?.login }})</span
        >
        <div><span class="i-carbon-email mx-2"></span>{{ data?.email }}</div>
        <div><span class="i-carbon-phone mx-2"></span>{{ data?.phone }}</div>
        <div><span class="i-carbon-wallet mx-2"></span>{{ data?.wallet }}₳</div>
        <div>
          <span class="i-carbon-chart-point mx-2"></span
          >{{ data?.correction_point }} points
        </div>
      </div>
    </div>
    <div class="card card-compact bg-base-100 shadow-xl m-4">
      <div class="card-body">
        <span class="card-title">Skills</span>
        <div v-for="skill in skills" :key="skill.id" class="m-2">
          {{ skill.name }}: {{ skill.level.toFixed(2) }}
        </div>
      </div>
    </div>
    <div class="card card-compact bg-base-100 shadow-xl m-4">
      <div class="card-body">
        <span class="card-title">Projects</span>
      </div>
    </div>
  </div>
</template>
