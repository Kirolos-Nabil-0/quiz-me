import * as examController from "../controllers/examControoler.js";
import { validateExamData, fetchExam, errorHandler } from "./middlewares";

import express from "express";

const router = express.Router();
router.post("/exams", validateExamData, examController.createExam);
router.get("/exams", examController.getAllExams);
router.get("/exams/:id", examController.getExamById);
router.put(
  "/exams/:id",
  [fetchExam, validateExamData],
  examController.updateExam
);
router.delete("/exams/:id", examController.deleteExam);
router.post(
  "/exams/:id/examiners",
  fetchExam,
  examController.addExaminerToExam
);
router.post(
  "/:id/submit",

  examController.submitExamAnswers
);

export default router;
