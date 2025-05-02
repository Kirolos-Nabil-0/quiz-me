<template>
  <v-app :theme="themeConfig">
    <v-app-bar color="primary" class="text-white">
      <v-app-bar-title>كنيسة الانبا انطونيوس</v-app-bar-title>
      <template v-slot:append>
        <v-btn icon="mdi-cross" variant="text"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <v-footer app class="bg-primary text-center text-white d-flex flex-column">
      <div>كنيسة الانبا انطونيوس بشبرا الخيمة © {{ new Date().getFullYear() }}</div>
      <div class="text-caption mt-1">مسابقه الخدام عيد القيامه</div>
    </v-footer>
  </v-app>
</template>

<script setup>
const themeConfig = ref('orthodoxTheme');
</script>

<style scoped>
/* Add any specific styling here */
</style> 