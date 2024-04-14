<template>
  <v-container>
    <v-card v-if="exam" class="mt-5">
      <v-card-title>{{ exam.name }}</v-card-title>
      <v-card-subtitle>Duration: {{ exam.duration }} minutes</v-card-subtitle>
      <v-card-text>
        <div>
          <h3>Questions:</h3>
          <ul>
            <li v-for="question in exam.questions" :key="question._id">
              {{ question.question }} - {{ question.answer }} (Score: {{ question.score }})
            </li>
          </ul>
        </div>
        <div v-if="exam.examiners.length > 0">
          <h3>Examiners:</h3>
          <ul>
            <li v-for="examiner in exam.examiners" :key="examiner._id">
              {{ examiner.name }} - Score: {{ examiner.score }}, Finish Time: {{ examiner.finish_time }}
            </li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
    <v-alert v-else type="error">
      Exam details could not be loaded.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const exam = ref(null);
const route = useRoute();

onMounted(async () => {
  await fetchExam();
});

async function fetchExam() {
  try {
    const response = await axios.get(`http://localhost:3001/api/exams/${route.params.id}`);
    exam.value = response.data;
  } catch (error) {
    console.error('Failed to fetch exam details:', error);
    exam.value = null;
  }
}
</script>

<style scoped>
h3 {
  margin-top: 20px;
}
</style>
