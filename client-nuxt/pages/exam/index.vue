<template>
  <v-container class="rtl pa-0">
    <!-- App bar for persistent exam information -->
    <v-app-bar v-if="examStore.examStarted" fixed density="comfortable" color="primary" elevation="2">
      <v-app-bar-title class="text-white font-weight-bold">{{ examStore.exam.title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-icon color="white" class="mr-1">mdi-clock-outline</v-icon>
        <span class="text-white">{{ formattedTime }}</span>
      </div>
    </v-app-bar>

    <div :class="{'pt-16': examStore.examStarted}">
      <v-card elevation="2" class="mx-auto exam-card" max-width="600px">
        <div v-if="!examStore.examStarted" class="exam-header bg-primary">
          <v-card-title class="text-h5 text-md-h4 text-white text-center">{{ 'مراجعة اولادالكنيسة' }}</v-card-title>
        </div>
        
        <v-card-text>
          <v-form v-if="!examStore.examStarted" @submit.prevent="startExam" class="pt-4">
            <div class="text-center my-4">
              <div class="easter-icon mb-2">
                <v-icon size="x-large" color="secondary">mdi-egg-easter</v-icon>
              </div>
              <p class="text-body-1 font-italic text-accent">
                "وَلكِنِ الآنَ قَدْ قَامَ الْمَسِيحُ مِنَ الأَمْوَاتِ وَصَارَ بَاكُورَةَ الرَّاقِدِينَ.
              </p>
              <p class="text-caption text-secondary">1 كو 15: ٢٠</p>
            </div>
            
            <v-text-field 
              v-model="examStore.examinerName" 
              label="اسم الخادم المشارك" 
              required
              :rules="[v => !!v || 'الرجاء إدخال اسمك']"
              density="comfortable"
              class="mb-6 name-input"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              color="secondary"
              bg-color="background"></v-text-field>
            <v-btn 
              type="submit" 
              color="secondary" 
              :disabled="!examStore.examinerName" 
              block
              size="large"
              class="mb-2 start-btn"
              variant="elevated"
              :ripple="true">
              <v-icon start>mdi-play-circle</v-icon>
              <span class="text-body-1">{{ 'بدء المراجعة' }}</span>
            </v-btn>
          </v-form>
          
          <div v-if="examStore.examStarted">
            <!-- Question progress indicator -->
            <div class="d-flex justify-space-between align-center mb-4">
              <v-chip color="primary" class="font-weight-medium">
                سؤال {{ currentQuestionIndex + 1 }} / {{ examStore.exam.questions.length }}
              </v-chip>
              <v-progress-linear
                :model-value="examStore.completionPercentage"
                color="success"
                height="8"
                class="w-75 rounded-lg"
              ></v-progress-linear>
            </div>
            
            <!-- Single question display -->
            <v-card 
              flat 
              class="pa-4 question-card" 
              :class="{'answered-card': examStore.answers[currentQuestionIndex] !== null}"
              rounded="lg">
              <v-card-title class="text-body-1 text-md-h6 d-flex">
                <div class="question-number mr-2 bg-primary">{{ currentQuestionIndex + 1 }}</div>
                <div>{{ currentQuestion.question }}</div>
              </v-card-title>
              <v-card-text>
                <v-radio-group 
                  v-model="examStore.answers[currentQuestionIndex]" 
                  class="mt-2">
                  <v-radio 
                    v-for="option in currentQuestion.options" 
                    :key="option" 
                    :label="option" 
                    :value="option"
                    density="comfortable"
                    color="primary"
                    class="py-2 option-radio"
                    ripple></v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>
            
            <!-- Navigation buttons -->
            <div class="d-flex justify-space-between mt-6">
              <v-btn
                color="grey-lighten-1"
                variant="elevated"
                :disabled="currentQuestionIndex === 0"
                @click="previousQuestion"
                size="large">
                <v-icon start>mdi-arrow-right</v-icon>
                السابق
              </v-btn>
              
              <v-btn
                color="primary"
                variant="elevated"
                :disabled="examStore.answers[currentQuestionIndex] === null"
                @click="nextQuestion"
                size="large"
                v-if="currentQuestionIndex < examStore.exam.questions.length - 1">
                التالي
                <v-icon end>mdi-arrow-left</v-icon>
              </v-btn>
              
              <v-btn
                color="secondary"
                variant="elevated"
                @click="confirmSubmit"
                size="large" 
                v-else
                :disabled="!canSubmit">
                إنهاء المراجعة
                <v-icon end>mdi-check-circle</v-icon>
              </v-btn>
            </div>
            
            <!-- Question selection chips for quick navigation -->
            <div class="mt-6 pa-2 overflow-x-auto d-flex">
              <v-chip
                v-for="(answer, index) in examStore.answers"
                :key="index"
                class="ma-1"
                :color="answer === null ? 'grey-lighten-2' : 'success'"
                :variant="currentQuestionIndex === index ? 'elevated' : 'flat'"
                @click="goToQuestion(index)"
                :text-color="answer === null ? 'grey-darken-1' : 'white'">
                {{ index + 1 }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    
    <!-- Submit confirmation dialog -->
    <v-dialog v-model="showSubmitDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">تأكيد تسليم المراجعة</v-card-title>
        <v-card-text>
          <p>هل أنت متأكد من رغبتك في تسليم إجابات المراجعة؟</p>
          <p v-if="!examStore.allAnswered" class="text-error">
            <v-icon color="error">mdi-alert-circle</v-icon>
            لديك {{ unansweredCount }} سؤال لم تجب عليه. هل ترغب في المتابعة؟
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="showSubmitDialog = false">إلغاء</v-btn>
          <v-btn 
            color="secondary" 
            variant="elevated" 
            @click="submitExam"
            :loading="examStore.isSubmitting">
            نعم، أرسل الإجابات
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Time warning snackbar -->
    <v-snackbar
      v-model="showTimeWarning"
      color="warning"
      timeout="5000"
      location="top">
      <div class="d-flex align-center">
        <v-icon start>mdi-clock-alert</v-icon>
        <span>تنبيه: بقي {{ Math.floor(remainingTime.value / 60) }} دقيقة من وقت المراجعة</span>
      </div>
    </v-snackbar>
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
const currentQuestionIndex = ref(0);
const showSubmitDialog = ref(false);
const showTimeWarning = ref(false);

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
});

const currentQuestion = computed(() => {
  if (examStore.exam && examStore.exam.questions) {
    return examStore.exam.questions[currentQuestionIndex.value];
  }
  return { question: '', options: [] };
});

const canSubmit = computed(() => {
  return examStore.answers[currentQuestionIndex.value] !== null;
});

const unansweredCount = computed(() => {
  return examStore.answers.filter(answer => answer === null).length;
});

function startExam() {
  if (examStore.examinerName) {
    examStore.initializeExam(id.value).then(() => {
      startTime.value = new Date();
      remainingTime.value = examStore.exam.duration * 60;
      timerInterval.value = setInterval(updateTimer, 1000);
      currentQuestionIndex.value = 0;
    }).catch(error => console.error('Failed to start exam:', error));
  }
}

function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime.value) / 1000);
  remainingTime.value = Math.max(examStore.exam.duration * 60 - elapsed, 0);
  
  // Show warning when 5 minutes or 2 minutes remain
  const minutesRemaining = Math.floor(remainingTime.value / 60);
  if ((minutesRemaining === 5 || minutesRemaining === 2) && remainingTime.value % 60 === 0) {
    showTimeWarning.value = true;
  }
  
  if (remainingTime.value <= 0) {
    clearInterval(timerInterval.value);
    submitExam();
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < examStore.exam.questions.length - 1) {
    currentQuestionIndex.value++;
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

function goToQuestion(index) {
  currentQuestionIndex.value = index;
}

function confirmSubmit() {
  showSubmitDialog.value = true;
}

function submitExam() {
  clearInterval(timerInterval.value);
  showSubmitDialog.value = false;
  examStore.submitExam(id.value).then(() => {
    router.push(`/exam/${id.value}/dashboard`);
  }).catch(error => console.error('Failed to submit exam:', error));
}

onMounted(() => {
  // Check for saved exam state on page load
  examStore.loadStateFromLocalStorage();
  
  // Initialize timer if exam was already started
  if (examStore.examStarted && examStore.startTime) {
    startTime.value = new Date(examStore.startTime);
    updateTimer();
    timerInterval.value = setInterval(updateTimer, 1000);
  }
  
  // Check time limit periodically
  setInterval(() => {
    examStore.checkTimeLimit();
  }, 60000);
  
  // Add event listener for beforeunload to save state
  window.addEventListener('beforeunload', examStore.saveStateToLocalStorage);
  
  // Listen for network changes
  window.addEventListener('online', examStore.updateNetworkStatus);
  window.addEventListener('offline', examStore.updateNetworkStatus);
});

onUnmounted(() => {
  clearInterval(timerInterval.value);
  window.removeEventListener('beforeunload', examStore.saveStateToLocalStorage);
  window.removeEventListener('online', examStore.updateNetworkStatus);
  window.removeEventListener('offline', examStore.updateNetworkStatus);
});
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}

.exam-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 80vh;
}

.exam-header {
  padding: 20px 24px;
  transition: background 0.5s ease;
  background-size: cover;
}

.question-card {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  min-height: 200px;
}

.answered-card {
  border-left: 4px solid #66BB6A;
  background-color: #f0fdf4;
}

.question-number {
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.option-radio {
  border-radius: 8px;
  transition: background 0.2s ease;
  min-height: 44px;
}

.option-radio:hover {
  background-color: #f3f4f6;
}

.name-input input {
  font-size: 1.1rem;
}

.start-btn {
  transition: all 0.3s ease;
  min-height: 50px;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.easter-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Mobile-specific styles */
@media (max-width: 600px) {
  .v-radio {
    padding: 12px 0;
  }
  
  .v-btn {
    min-height: 44px;
  }
  
  .exam-card {
    margin: 0;
    border-radius: 12px;
    min-height: 85vh;
  }
  
  .overflow-x-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
}
</style>
