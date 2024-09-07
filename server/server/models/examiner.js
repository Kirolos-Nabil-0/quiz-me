import mongoose from "mongoose";

export const examinerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  finish_time: {
    // set the defult to curernt timeStamp
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    required: true,
  },
});

export const Examiner = mongoose.model("Examiner", examinerSchema);

// Path: server/models/examiner.js
