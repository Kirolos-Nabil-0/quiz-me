<template>
  <v-container class="rtl">
    <v-form @submit.prevent="submitExam">
      <v-text-field v-model="exam.name" label="اسم الامتحان" required></v-text-field>
      <v-text-field v-model="exam.duration" label="المدة (بالدقائق)" type="number" required></v-text-field>

      <v-btn color="primary" @click="addQuestion">أضف سؤال</v-btn>
      <div v-for="(question, index) in exam.questions" :key="index">
        <v-text-field v-model="question.question" label="السؤال" required></v-text-field>
        <v-text-field v-model="question.answer" label="الإجابة الصحيحة" required></v-text-field>
        <v-text-field v-model="question.options" label="الخيارات (مفصولة بفواصل)" hint="ادخل الخيارات مفصولة بفواصل"
          required></v-text-field>
        <v-text-field v-model="question.score" label="الدرجة" type="number" required></v-text-field>
        <v-btn color="error" @click="removeQuestion(index)">احذف السؤال</v-btn>
      </div>
      <v-btn color="success" type="submit">أرسل الامتحان</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const exam = ref({
  name: '',
  duration: '',
  questions: [],
  examiners: []
});

const router = useRouter();

function addQuestion() {
  exam.value.questions.push({
    question: '',
    answer: '',
    options: '',  // Changed from an array to a string
    score: ''
  });
}

function removeQuestion(index) {
  exam.value.questions.splice(index, 1);
}

async function submitExam() {
  // Convert options strings to arrays
  exam.value.questions.forEach(question => {
    question.options = question.options.split(',').map(option => option.trim());  // Split by commas and trim whitespace
  });

  try {
    const response = await axios.post('https://quiz-6hm9b.ondigitalocean.app/api/exams', exam.value);
    if (response.status === 201) {
      router.push('/admin/');  // Assuming this is the correct route
    }
  } catch (error) {
    console.error('Failed to submit exam:', error.response ? error.response.data : error.message);
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}
</style>
