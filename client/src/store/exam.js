import { defineStore } from "pinia";
import axios from "axios";

export const useExamStore = defineStore("exam", {
  state: () => ({
    exam: {},
    examinerName: "",
    answers: [],
    examStarted: false,
    startTime: null,
  }),
  getters: {
    allAnswered(state) {
      return state.answers.every((answer) => answer != null);
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
    async initializeExam(examId) {
      this.loadStateFromLocalStorage();
      if (!this.examStarted && examId) {
        await this.startExam(examId);
      }
    },
    async startExam(examId) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/exams/${examId}`
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
    async submitExam(id) {
      if (this.examStarted && this.allAnswered) {
        const endTime = new Date();
        const timeTaken = (endTime - this.startTime) / 1000; // seconds
        const submission = {
          examinerName: this.examinerName,
          answers: this.answers,
          finish_time: timeTaken,
        };
        try {
          await axios.post(
            `http://localhost:3001/api/${id}/submit`,
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
      const timePassed = (new Date() - this.startTime) / 60000;
      if (this.exam.duration && timePassed >= this.exam.duration) {
        this.submitExam(this.exam._id);
      }
    },
  },
});
