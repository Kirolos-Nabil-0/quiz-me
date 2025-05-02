// Add TypeScript ES2015+ compatibility
// @ts-ignore
if (!Promise) { /* This ensures Promise is recognized by TypeScript */ }
// @ts-ignore
if (!Array.prototype.fill) { /* This ensures Array.fill is recognized by TypeScript */ }

import { defineStore } from "pinia";
import axios from "axios";

const API_BASE_URL = "https://quiz-6hm9b.ondigitalocean.app/api";

interface Exam {
  _id?: string;
  title?: string;
  questions?: any[];
  duration?: number;
}

interface Submission {
  examinerName: string;
  answers: (string | null)[];
  finish_time: number;
}

export const useExamStore = defineStore("exam", {
  state: () => ({
    exam: {} as Exam,
    examinerName: "",
    answers: [] as (string | null)[],
    examStarted: false,
    startTime: null as Date | null,
    isSubmitting: false,
    isOffline: false,
    pendingSubmission: null as Submission | null,
    error: null as string | null,
    lastSavedTime: null as Date | null,
  }),
  getters: {
    allAnswered(state): boolean {
      return state.answers.every((answer) => answer !== null);
    },
    completionPercentage(state): number {
      if (!state.answers.length) return 0;
      const answered = state.answers.filter(a => a !== null).length;
      return Math.round((answered / state.answers.length) * 100);
    },
  },
  actions: {
    loadStateFromLocalStorage() {
      try {
        const state = localStorage.getItem("examState");
        if (state) {
          const parsedState = JSON.parse(state);
          // Convert startTime string back to Date object if it exists
          if (parsedState.startTime) {
            parsedState.startTime = new Date(parsedState.startTime);
          }
          // Only restore if the exam was started and not too old (24h max)
          if (parsedState.examStarted && parsedState.startTime) {
            const now = new Date();
            const startTime = new Date(parsedState.startTime);
            const hoursSinceStart = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceStart < 24) {
              this.$state = parsedState;
              console.log("Restored exam state from localStorage");
            } else {
              // Clear expired state
              localStorage.removeItem("examState");
              console.log("Cleared expired exam state");
            }
          }
        }
      } catch (error) {
        console.error("Failed to load state from localStorage:", error);
      }
    },
    saveStateToLocalStorage() {
      try {
        localStorage.setItem("examState", JSON.stringify(this.$state));
        this.lastSavedTime = new Date();
      } catch (error) {
        console.error("Failed to save state to localStorage:", error);
      }
    },
    async initializeExam(examId: string) {
      this.loadStateFromLocalStorage();
      
      // Check if we already started this exam
      if (this.examStarted && this.exam._id === examId) {
        console.log("Resuming existing exam", examId);
        return;
      }
      
      if (!this.examStarted && examId) {
        await this.startExam(examId);
      }
    },
    async startExam(examId: string) {
      try {
        this.error = null;
        this.isOffline = false;
        
        const response = await axios.get(
          `${API_BASE_URL}/exams/${examId}`
        );
        this.exam = response.data;
        this.answers = new Array(response.data.questions.length).fill(null);
        this.examStarted = true;
        this.startTime = new Date();
        this.saveStateToLocalStorage();
      } catch (error) {
        console.error("Failed to fetch exam:", error);
        this.error = "فشل في تحميل الاختبار، يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى";
        this.isOffline = !navigator.onLine;
      }
    },
    async submitExam(id: string) {
      if (!this.examStarted || !this.allAnswered) {
        return;
      }
      
      this.isSubmitting = true;
      this.error = null;
      
      try {
        const endTime = new Date();
        const timeTaken =
          (endTime.getTime() - this.startTime!.getTime()) / 1000; // seconds
        
        const submission: Submission = {
          examinerName: this.examinerName,
          answers: this.answers,
          finish_time: timeTaken,
        };
        
        // Check network connectivity
        if (!navigator.onLine) {
          this.isOffline = true;
          this.pendingSubmission = submission;
          this.saveStateToLocalStorage();
          this.error = "أنت غير متصل بالإنترنت. سيتم حفظ إجاباتك وإرسالها عند استعادة الاتصال.";
          this.isSubmitting = false;
          return Promise.reject(new Error("Offline, submission stored"));
        }
        
        await axios.post(
          `${API_BASE_URL}/${id}/submit`,
          submission
        );
        
        this.resetExam();
        this.isSubmitting = false;
        return Promise.resolve();
        
      } catch (error) {
        console.error("Failed to submit exam:", error);
        this.isSubmitting = false;
        this.error = "فشل في إرسال الاختبار، يرجى المحاولة مرة أخرى";
        return Promise.reject(error);
      }
    },
    async retrySubmission(id: string) {
      if (!this.pendingSubmission) {
        return Promise.resolve();
      }
      
      try {
        this.isSubmitting = true;
        this.error = null;
        
        await axios.post(
          `${API_BASE_URL}/${id}/submit`,
          this.pendingSubmission
        );
        
        this.resetExam();
        this.isSubmitting = false;
        return Promise.resolve();
        
      } catch (error) {
        console.error("Failed to retry submission:", error);
        this.isSubmitting = false;
        this.error = "فشل في إرسال الاختبار، يرجى المحاولة مرة أخرى";
        return Promise.reject(error);
      }
    },
    resetExam() {
      this.exam = {};
      this.answers = [];
      this.examStarted = false;
      this.startTime = null;
      this.isSubmitting = false;
      this.isOffline = false;
      this.pendingSubmission = null;
      this.error = null;
      this.lastSavedTime = null;
      localStorage.removeItem("examState");
    },
    checkTimeLimit() {
      if (!this.examStarted || !this.startTime || !this.exam.duration) {
        return;
      }
      
      const timePassed =
        (new Date().getTime() - this.startTime.getTime()) / 60000; // minutes
      
      // Auto-save state every minute
      this.saveStateToLocalStorage();
      
      if (timePassed >= this.exam.duration) {
        this.submitExam(this.exam._id!);
      }
    },
    updateNetworkStatus() {
      this.isOffline = !navigator.onLine;
      
      // If connection is restored and we have a pending submission, retry
      if (navigator.onLine && this.pendingSubmission && this.exam._id) {
        this.retrySubmission(this.exam._id);
      }
    },
  },
});
