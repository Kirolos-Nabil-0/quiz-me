import { defineStore } from "pinia";
import axios from "axios";

interface Exam {
  _id?: string;
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
  }),
  getters: {
    allAnswered(state): boolean {
      return state.answers.every((answer) => answer !== null);
    },
  },
  actions: {
    loadStateFromLocalStorage() {
      const state = localStorage.getItem("examState");
      if (state) {
        this.$state = JSON.parse(state);
      }
    },
    saveStateToLocalStorage() {
      localStorage.setItem("examState", JSON.stringify(this.$state));
    },
    async initializeExam(examId: string) {
      this.loadStateFromLocalStorage();
      if (!this.examStarted && examId) {
        await this.startExam(examId);
      }
    },
    async startExam(examId: string) {
      try {
        const response = await axios.get(
          `https://quiz-me-h886.onrender.com/api/exams/${examId}`
        );
        this.exam = response.data;
        this.answers = new Array(response.data.questions.length).fill(null);
        this.examStarted = true;
        this.startTime = new Date();
        this.saveStateToLocalStorage();
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    },
    async submitExam(id: string) {
      if (this.examStarted && this.allAnswered) {
        const endTime = new Date();
        const timeTaken =
          (endTime.getTime() - this.startTime!.getTime()) / 1000; // seconds
        const submission: Submission = {
          examinerName: this.examinerName,
          answers: this.answers,
          finish_time: timeTaken,
        };
        try {
          await axios.post(
            `https://quiz-me-h886.onrender.com/api/${id}/submit`,
            submission
          );
          this.resetExam();
        } catch (error) {
          console.error("Failed to submit exam:", error);
        }
      } else {
        alert("Please complete all answers before submitting.");
      }
    },
    resetExam() {
      this.exam = {};
      this.answers = [];
      this.examStarted = false;
      this.startTime = null;
      localStorage.removeItem("examState");
    },
    checkTimeLimit() {
      const timePassed =
        (new Date().getTime() - this.startTime!.getTime()) / 60000; // minutes
      if (this.exam.duration && timePassed >= this.exam.duration) {
        this.submitExam(this.exam._id!);
      }
    },
  },
});
