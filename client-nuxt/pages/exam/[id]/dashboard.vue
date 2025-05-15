<template>
  <v-container class="pa-2">
    <v-card elevation="2" class="mx-auto dashboard-card" max-width="800px">
      <div class="dashboard-header">
        <v-card-title class="text-h5 text-md-h4 text-white">
          <div class="d-flex flex-column flex-md-row align-md-center">
            <span>{{ examDetails.name }} </span>
            <v-chip class="ma-2" color="white" text-color="primary" size="small" variant="outlined">
              {{ examiners.length }} خادم مشارك
            </v-chip>
          </div>
        </v-card-title>
      </div>
      
      <!-- Mobile view: Leaderboard cards -->
      <div class="d-md-none pa-3 bg-beige">
        <div v-if="initialLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-3">جاري تحميل النتائج لأول مرة...</div>
        </div>
        <div v-else-if="loading && !refreshing" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
          <div class="mt-2">جاري تحديث النتائج...</div>
        </div>
        <div v-else-if="sortedExaminers.length === 0" class="text-center pa-8 no-results">
          <v-icon size="64" color="grey lighten-1">mdi-account-question</v-icon>
          <div class="text-h6 mt-4">لم يشارك أي خادم في المراجعة حتى الآن</div>
        </div>
        <v-card-actions class="justify-center pt-1 pb-4">
          <div class="d-flex flex-column align-center">
            <div class="d-flex mb-2">
              <v-btn 
                color="primary" 
                @click="refreshData" 
                size="small"
                rounded
                variant="tonal"
                class="refresh-btn me-2"
                :loading="refreshing"
                prepend-icon="mdi-refresh">
                تحديث النتائج
              </v-btn>
              <v-btn
                :color="realtimeEnabled ? 'success' : 'error'"
                size="small"
                icon
                variant="tonal"
                @click="toggleRealtime"
                rounded
                class="realtime-toggle">
                <v-icon>{{ realtimeEnabled ? 'mdi-sync' : 'mdi-sync-off' }}</v-icon>
              </v-btn>
            </div>
            <div v-if="!realtimeEnabled" class="text-caption text-error">التحديث التلقائي متوقف</div>
            <div v-else class="text-caption text-success">التحديث التلقائي نشط</div>
          </div>
        </v-card-actions>
        <v-slide-y-transition group>
          <v-card 
            v-for="(item, index) in sortedExaminers" 
            :key="item.name + index" 
            class="mb-3 rank-card" 
            variant="outlined" 
            :class="getRankClass(index)"
            elevation="1">
            <div class="d-flex align-center pa-3">
              <div 
                class="rank-indicator" 
                :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
              <div class="flex-grow-1 me-3 d-flex justify-space-between align-center">
                <div class="text-subtitle-1 font-weight-medium">{{ item.name }}</div>
                <v-chip size="small" :color="getScoreColor(item.score)" class="score-chip">
                  {{ item.score }} نقطة
                </v-chip>
              </div>
            </div>
            <div class="px-3 pb-2 d-flex justify-end">
              <span class="text-caption text-grey">{{ formatTime(item.finish_time) }}</span>
            </div>
          </v-card>
        </v-slide-y-transition>
      </div>
      
      <!-- Desktop view: Table -->
      <v-card-text class="d-none d-md-block bg-beige">
        <div v-if="initialLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-3">جاري تحميل النتائج لأول مرة...</div>
        </div>
        <div v-else-if="loading && !refreshing" class="text-center py-4">
          <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
          <div class="mt-2">جاري تحديث النتائج...</div>
        </div>
        <div v-else>
          <v-card-actions class="justify-end pb-3">
            <div class="d-flex align-center">
              <div v-if="!realtimeEnabled" class="me-2 text-error text-caption">
                <v-icon small color="error">mdi-sync-off</v-icon>
                التحديث التلقائي متوقف
              </div>
              <div v-else class="me-2 text-success text-caption">
                <v-icon small color="success">mdi-sync</v-icon>
                التحديث التلقائي نشط
              </div>
              <v-switch
                v-model="realtimeEnabled"
                color="success"
                hide-details
                density="compact"
                class="me-2"
                @change="toggleRealtime"
              ></v-switch>
              <v-btn 
                color="primary" 
                @click="refreshData" 
                size="large"
                variant="tonal"
                class="refresh-btn"
                :loading="refreshing"
                prepend-icon="mdi-refresh"
                rounded>
                تحديث النتائج
              </v-btn>
            </div>
          </v-card-actions>
          <v-data-table 
            :headers="headers" 
            :items="sortedExaminers" 
            class="elevation-1 results-table">
            <template #item.rank="{ index }">
              <div class="d-flex justify-center">
                <div 
                  class="rank-indicator-small" 
                  :class="getRankClass(index)">
                  {{ index + 1 }}
                </div>
              </div>
            </template>
            <template #item.score="{ item }">
              <v-chip size="small" :color="getScoreColor(item.score)" class="score-chip">
                {{ item.score }}
              </v-chip>
            </template>
            <template #item.finish_time="{ item }">
              {{ formatDateTime(item.finish_time) }}
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Footer -->
    <div class="text-center mt-3 footer-text">
      كنيسة القديس أنطونيوس بباسوس © {{ new Date().getFullYear() }}
    </div>
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
const loading = ref(true);
const refreshing = ref(false);
const initialLoading = ref(true);
const realtimeEnabled = ref(true);

const headers = ref([
  { title: '#', align: 'center', key: 'rank', width: '70px' },
  { title: 'اسم الخادم', align: 'start', key: 'name' },
  { title: 'النتيجة', key: 'score', align: 'center' },
  { title: 'وقت الانتهاء', key: 'finish_time', align: 'center' }
]);

onMounted(() => {
  fetchExamDetails();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});

function startPolling() {
  if (!pollingInterval.value) {
    pollingInterval.value = setInterval(fetchExamDetails, 5000);
  }
}

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
}

function toggleRealtime() {
  realtimeEnabled.value = !realtimeEnabled.value;
  if (realtimeEnabled.value) {
    startPolling();
  } else {
    stopPolling();
  }
}

async function fetchExamDetails() {
  if (!initialLoading.value && loading.value && !refreshing.value) return;
  
  try {
    loading.value = true;
    
    const { data } = await axios.get(`https://quiz-6hm9b.ondigitalocean.app/api/exams/${route.params.id}`);
    
    if (JSON.stringify(data) !== JSON.stringify(examDetails.value)) {
      examDetails.value = data;
      examiners.value = data.examiners || [];
    }
    
    loading.value = false;
    initialLoading.value = false;
  } catch (error) {
    console.error('Failed to fetch exam details:', error);
    loading.value = false;
    initialLoading.value = false;
  }
}

function refreshData() {
  if (loading.value) return;
  
  refreshing.value = true;
  fetchExamDetails().finally(() => {
    setTimeout(() => {
      refreshing.value = false;
    }, 2000);
  });
}

const sortedExaminers = computed(() => {
  return [...examiners.value].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(a.finish_time) - new Date(b.finish_time);
  });
});

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function formatTime(dateTimeStr) {
  try {
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString().split(',')[0]} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  } catch (e) {
    return dateTimeStr;
  }
}

function getRankClass(index) {
  if (index === 0) return 'first-place';
  if (index === 1) return 'second-place';
  if (index === 2) return 'third-place';
  return '';
}

function getScoreColor(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
}
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dashboard-header {
  background: linear-gradient(135deg, #963634 0%, #963634 100%);
  padding: 20px 24px;
  position: relative;
  overflow: hidden;
}

.dashboard-header::after {
  content: '';
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-image: url('/images/easter-cross.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.7;
}

.bg-beige {
  background-color: #f8f4e9;
}

.rank-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: white;
  border: 1px solid #eee !important;
  overflow: hidden;
}

.rank-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.07) !important;
}

.rank-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0e0e0;
  font-weight: bold;
  font-size: 1rem;
  color: white;
}

.rank-indicator-small {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  font-weight: bold;
  font-size: 0.9rem;
  color: white;
}

.first-place {
  border-color: #FFD700 !important;
}

.first-place.rank-indicator, .first-place .rank-indicator, .first-place.rank-indicator-small {
  background-color: #FFD700;
  color: #333;
}

.second-place {
  border-color: #C0C0C0 !important;
}

.second-place.rank-indicator, .second-place .rank-indicator, .second-place.rank-indicator-small {
  background-color: #C0C0C0;
  color: #333;
}

.third-place {
  border-color: #CD7F32 !important;
}

.third-place.rank-indicator, .third-place .rank-indicator, .third-place.rank-indicator-small {
  background-color: #CD7F32;
  color: white;
}

.refresh-btn {
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
}

.realtime-toggle {
  transition: all 0.3s ease;
}

.realtime-toggle:hover {
  transform: translateY(-2px);
}

.score-chip {
  font-weight: bold;
  transition: all 0.3s ease;
}

.no-results {
  opacity: 0.7;
}

.results-table {
  border-radius: 12px;
  overflow: hidden;
}

.footer-text {
  color: #963634;
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Animation for rankings changes */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Mobile-specific styles */
@media (max-width: 600px) {
  .dashboard-card {
    border-radius: 0;
    margin: -8px;
    box-shadow: none;
  }
  
  .rank-card {
    margin-right: 4px;
    margin-left: 4px;
  }
  
  .refresh-btn {
    position: relative;
    z-index: 1;
  }
}
</style>
