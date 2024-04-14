<template>
  <v-container class="rtl">
    <v-card>
      <v-card-title v-if="!examStore.examStarted">{{ 'بدء الامتحان' }}</v-card-title>
      <v-card-title v-else>{{ examStore.exam.title }}</v-card-title>
      <v-card-subtitle v-if="examStore.examStarted">{{ `المدة: ${formattedTime}` }}</v-card-subtitle>
      <v-card-text>
        <v-form v-if="!examStore.examStarted" @submit.prevent="startExam">
          <v-text-field v-model="examStore.examinerName" label="اسم الممتحن" required
            :rules="[v => !!v || 'الرجاء إدخال اسم الممتحن']"></v-text-field>
          <v-btn type="submit" color="primary" :disabled="!examStore.examinerName">{{ 'بدء الامتحان' }}</v-btn>
        </v-form>
        <div v-if="examStore.examStarted">
          <div v-for="(question, index) in examStore.exam.questions" :key="question.id">
            <v-card flat class="mb-3">
              <v-card-title>{{ question.question }}</v-card-title>
              <v-card-text>
                <v-radio-group v-model="examStore.answers[index]">
                  <v-radio v-for="option in question.options" :key="option" :label="option" :value="option"></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-card-text>
      <v-card-actions v-if="examStore.examStarted">
        <v-btn color="primary" @click="submitExam" :disabled="!examStore.allAnswered">{{ submitButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="js">
import { useExamStore } from '../../store/exam';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const examStore = useExamStore();
const id = ref(route.query.id);
const timerInterval = ref(null);
const startTime = ref(null);
const remainingTime = ref(0);

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes} دقيقة و ${seconds} ثانية`;
});

const submitButtonText = computed(() => examStore.allAnswered ? 'إرسال الإجابات' : 'أجب على جميع الأسئلة أولاً');

function startExam() {
  if (examStore.examinerName) {
    examStore.initializeExam(id.value).then(() => {
      startTime.value = new Date();
      remainingTime.value = examStore.exam.duration * 60;
      timerInterval.value = setInterval(updateTimer, 1000);
    }).catch(error => console.error('Failed to start exam:', error));
  }
}

function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime.value) / 1000);
  remainingTime.value = Math.max(examStore.exam.duration * 60 - elapsed, 0);
  if (remainingTime.value <= 0) {
    clearInterval(timerInterval.value);
    submitExam();
  }
}

function submitExam() {
  clearInterval(timerInterval.value);
  examStore.submitExam(id.value).then(() => {
    router.push(`/exam/${id.value}/dashboard`);
  }).catch(error => console.error('Failed to submit exam:', error));
}

onMounted(() => {
  setInterval(() => {
    examStore.checkTimeLimit();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
  margin: 8px;
}
</style>
