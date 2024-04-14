<template>
  <v-container class="rtl">
    <v-card>
      <v-card-title>بدء الامتحان</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="startExam">
          <v-text-field v-model="examinerName" label="اسم الممتحن" required :rules="[rules.required]"></v-text-field>
          <v-btn type="submit" color="primary">بدء الامتحان</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const examinerName = ref('');
const router = useRouter();

const rules = {
  required: value => !!value || 'الحقل مطلوب',
};

function startExam() {
  if (examinerName.value) {
    // Pass the examiner's name and navigate to the exam page
    // Assuming you have a route named 'Exam' and you pass the name as a query parameter
    router.push({ name: 'Exam', query: { examiner: examinerName.value } });
  }
}
</script>

<style scoped>
.rtl {
  direction: rtl;
  text-align: right;
}
</style>
