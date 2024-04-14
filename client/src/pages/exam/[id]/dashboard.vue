<template>
  <v-container>
    <v-card>
      <v-card-title>Examiner Rankings for {{ examDetails.name }}</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="sortedExaminers" class="elevation-1">
          <template #item.finish_time="{ item }">
            {{ formatDateTime(item.finish_time) }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const examDetails = ref({});
const examiners = ref([]);
const pollingInterval = ref(null);
const headers = ref([
  { title: 'Examiner Name', align: 'start', value: 'name' },
  { title: 'Score', value: 'score' },
  { title: 'Finish Time', value: 'finish_time' }
]);

onMounted(() => {
  fetchExamDetails();
  pollingInterval.value = setInterval(fetchExamDetails, 30000);
});

onUnmounted(() => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }
});

async function fetchExamDetails() {
  try {
    const { data } = await axios.get(`http://localhost:3001/api/exams/${route.params.id}`);
    examDetails.value = data;
    examiners.value = data.examiners || [];
  } catch (error) {
    console.error('Failed to fetch exam details:', error);
  }
}

const sortedExaminers = computed(() => {
  return examiners.value.sort((a, b) => b.score - a.score);
});

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
</script>

<style scoped></style>
