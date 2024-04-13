import mongoose from "mongoose";

export const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  score: {
    type: Number,
    default: 1,
  },
});

export const Question = mongoose.model("Question", questionSchema);

// Path: server/models/question.js
