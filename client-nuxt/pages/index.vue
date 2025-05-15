<template>
  <v-container fluid class="rtl">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" class="text-center">
        <v-card class="mx-auto my-4 elevation-3" rounded="lg">
          <v-img
            src="/images/orthodox-icon.jpg"
            height="300"
            width="100%"
            contain
            class="bg-surface-variant"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="secondary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-title class="text-h4 font-weight-bold text-primary pt-6 text-center">
            كنيسة الانبا انطونيوس بشبرا الخيمة و توابعها
          </v-card-title>
          <v-card-subtitle class="text-center text-secondary pb-0">
            مراجعة الاولادلامتحان الدين المسيحي
          </v-card-subtitle>
          <v-card-text class="text-center">
            <v-btn 
              color="primary" 
              size="large" 
              rounded="pill"
              variant="elevated"
              :ripple="true"
              class="mt-4 mb-6"
              to="/StartExam"
            >
              بدء الامتحان
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
// Component logic here
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}
</style>
