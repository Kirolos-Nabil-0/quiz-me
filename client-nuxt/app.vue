<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Set RTL for the entire app
import { onMounted } from 'vue';

onMounted(() => {
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
});
</script>

<style>
/* Global RTL styles */
html {
  direction: rtl;
}

body {
  text-align: right;
  font-family: 'Arial', 'Tahoma', sans-serif;
}

.v-application {
  direction: rtl !important;
}

/* Fix icon positioning in RTL */
.v-btn__prepend {
  margin-right: 0;
  margin-left: 8px;
}

.v-btn__append {
  margin-left: 0;
  margin-right: 8px;
}
</style>