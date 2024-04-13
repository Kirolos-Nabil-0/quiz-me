import mongoose from "mongoose";
import { questionSchema } from "./question.js";
import { Examiner } from "./examiner.js";
export const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  examiners: {
    type: [Examiner.schema],
    default: [],
  },
});

export const Exam = mongoose.model("Exam", examSchema);

// Path: server/models/question.js
