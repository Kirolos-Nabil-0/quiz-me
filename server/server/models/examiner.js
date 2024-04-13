import mongoose from "mongoose";

export const examinerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  finish_time: {
    type: Date,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export const Examiner = mongoose.model("Examiner", examinerSchema);

// Path: server/models/examiner.js
