<template>
  <v-container class="rtl">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="elevation-3" rounded="lg">
          <v-card-item class="bg-primary">
            <v-card-title class="text-h4 text-white text-center">
              اختيار المراجعة
            </v-card-title>
          </v-card-item>
          
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12">
                <div class="text-center my-4">
                  <p class="text-body-1 font-italic text-accent">
             "       لَيْسَ هُوَ هَهُنَا، لَكِنَّهُ قَامَ! اُذْكُرْنَ كَيْفَ كَلَّمَكُنَّ وَهُوَ بَعْدُ فِي ٱلْجَلِيلِ قَائِلًا: إِنَّهُ يَنْبَغِي أَنْ يُسَلَّمَ ٱبْنُ ٱلْإِنْسَانِ فِي أَيْدِي أُنَاسٍ خُطَاةٍ، وَيُصْلَبَ، وَفِي ٱلْيَوْمِ ٱلثَّالِثِ يَقُومُ."
                  </p>
                  <p class="text-caption text-secondary"> لُوقَا ٢٤:‏٦-‏٧</p>
                </div>
              </v-col>
            </v-row>
            
            <v-alert 
              v-if="loading" 
              type="info" 
              variant="tonal" 
              class="mb-4"
            >
              جاري تحميل الامتحانات...
            </v-alert>
            
            <v-alert 
              v-if="error" 
              type="error" 
              variant="tonal" 
              class="mb-4"
            >
              {{ error }}
            </v-alert>
            
            <v-card 
              v-for="exam in exams" 
              :key="exam._id" 
              variant="outlined" 
              class="mb-4 exam-card"
              rounded="lg"
              flat
            >
              <div class="d-flex align-center justify-space-between pa-4 rtl">
                <v-btn 
                  color="amber" 
                  variant="text" 
                  @click="enterExam(exam._id)"
                  class="font-weight-bold"
                >
                  <v-icon start color="amber-darken-3">mdi-play</v-icon>
                  <span class="text-amber-darken-3">بدء الامتحان</span>
                </v-btn>
                
                <div class="d-flex align-center">
                  <span class="text-primary ml-3">{{ exam.name }}</span>
                  <div class="d-flex align-center">
                    <span class="text-grey text-body-2 ml-1">{{ exam.duration }} دقيقة</span>
                    <v-icon color="grey" size="small">mdi-clock-outline</v-icon>
                  </div>
                </div>
              </div>
            </v-card>
            
            <v-alert 
              v-if="exams.length === 0 && !loading && !error" 
              type="info" 
              variant="tonal" 
              class="mt-4"
            >
              لا توجد امتحانات متاحة حاليًا
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useExamStore } from '../store/exam';
import axios from 'axios';

const router = useRouter();
const examStore = useExamStore();
const exams = ref([]);
const loading = ref(false);
const error = ref('');
const API_BASE_URL = "https://quiz-6hm9b.ondigitalocean.app/api";

async function fetchExams() {
  loading.value = true;
  error.value = '';
  try {
    const response = await axios.get(`${API_BASE_URL}/exams`);
    exams.value = response.data;
  } catch (err) {
    console.error('Error fetching exams:', err);
    error.value = 'حدث خطأ أثناء تحميل الامتحانات، يرجى المحاولة مرة أخرى';
  } finally {
    loading.value = false;
  }
}

function enterExam(examId) {
  // Navigate to the exam page with the exam ID
  router.push({ path: '/exam', query: { id: examId } });
}

onMounted(() => {
  fetchExams();
});
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}

.exam-card {
  transition: transform 0.2s ease;
}

.exam-card:hover {
  transform: translateY(-4px);
}
</style>
