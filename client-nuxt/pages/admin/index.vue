<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Exams</v-card-title>
          <v-card-text>
            <!-- Convert button to link using the `to` attribute -->
            <v-btn color="primary" to="add-exam">Add Exam</v-btn>
          </v-card-text>
          <ExamsTable />
        </v-card>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="exams" class="elevation-1" :loading="loading"
      loading-text="Loading... Please wait">
      <template #item.name="{ item }">
        <strong>{{ item.name }}</strong>
      </template>
      <template #item.duration="{ item }">
        {{ item.duration }} minutes
      </template>
      <template #item.actions="{ item }">
        <!-- Convert buttons to link using the `to` attribute -->
        <v-btn small color="primary" :to="{ path: `/admin/exams/${item._id}` }">View</v-btn>
        <!-- /exam?id-->
        <v-btn small color="green" :to="`/exam?id=${item._id}`">Start</v-btn>

        <v-btn small color="green" :to="{ path: `/exam/${item._id}/dashboard` }">Dashboard</v-btn>
        <v-btn small color="error" @click="deleteExam(item)">Delete</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const exams = ref([]);
const loading = ref(false);
const router = useRouter();

const headers = ref([
  { title: 'Exam Name', align: 'start', value: 'name' },
  { title: 'Duration', value: 'duration' },
  { title: 'Actions', value: 'actions', sortable: false }
]);

onMounted(async () => {
  loading.value = true;
  await fetchExams();
});

async function fetchExams() {
  try {
    const response = await axios.get('https://quiz-6hm9b.ondigitalocean.app/api/exams');
    exams.value = response.data;
  } catch (error) {
    console.error('Failed to fetch exams:', error);
  } finally {
    loading.value = false;
  }
}

async function deleteExam(exam) {
  try {
    await axios.delete(`https://quiz-6hm9b.ondigitalocean.app/api/exams/${exam._id}`);
    await fetchExams(); // Refresh list after deletion
  } catch (error) {
    console.error('Failed to delete exam:', error);
  }
}
</script>

<style scoped></style>
