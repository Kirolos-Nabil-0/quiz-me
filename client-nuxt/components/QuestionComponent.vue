<template>
  <v-container class="rtl">
    <v-card class="mb-3">
      <v-card-title>{{ question.question }}</v-card-title>
      <v-card-text>
        <v-radio-group v-model="selectedOption" column>
          <v-radio v-for="(option, index) in question.options" :key="index" :label="option" :value="option"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});

const selectedOption = ref('');
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}
</style>
