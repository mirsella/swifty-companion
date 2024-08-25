<script setup lang="ts">
const { $getLoginData, $signout } = useNuxtApp();
const route = useRoute();
const data = ref<UserApiResponse | null>(null);

(async () => {
  try {
    const res = await $getLoginData(route.params.login as string);
    if (!res) {
      await navigateTo("/?error=login not found");
    }
    data.value = res;
  } catch (error) {
    console.error(error);
    await $signout();
  }
})();

const skills = computed(() => {
  if (!data.value) {
    return [];
  }
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
    <div v-if="!data" class="flex justify-center h-36">
      <span class="!w-16 loading loading-infinity"></span>
    </div>
    <template v-else>
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
          <div>
            <span class="i-carbon-wallet mx-2"></span>{{ data?.wallet }}₳
          </div>
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
            <span class="font-bold"> {{ skill.name }}: </span>
            {{ skill.level.toFixed(2) }}
          </div>
        </div>
      </div>
      <div class="card card-compact bg-base-100 shadow-xl m-4">
        <div class="card-body">
          <span class="card-title">Projects</span>
          <div
            v-for="project in data?.projects_users"
            :key="project.id"
            class="m-2 shadow-md rounded-lg p-1"
            :class="{
              'shadow-error': project['validated?'] === false,
              'shadow-success': project['validated?'] === true,
            }"
          >
            <div class="w-full">
              <span class="font-bold">{{ project.project.name }}</span> status:
              {{ project.status }}
            </div>
            <span v-if="project.final_mark">
              mark: {{ project.final_mark }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
