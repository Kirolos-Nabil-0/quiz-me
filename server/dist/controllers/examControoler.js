"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExam = exports.submitExamAnswers = exports.getExamById = exports.getAllExams = exports.deleteExam = exports.createExam = exports.addExaminerToExam = void 0;
var _exam = require("../models/exam");
// controllers/examController.js

const createExam = async (req, res) => {
  try {
    const exam = new _exam.Exam(req.body);
    await exam.save();
    res.status(201).send(exam);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.createExam = createExam;
const getAllExams = async (req, res) => {
  try {
    const exams = await _exam.Exam.find();
    res.status(200).send(exams);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getAllExams = getAllExams;
const getExamById = async (req, res) => {
  try {
    const exam = await _exam.Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).send();
    }
    res.status(200).send(exam);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getExamById = getExamById;
const updateExam = async (req, res) => {
  try {
    const exam = await _exam.Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!exam) {
      return res.status(404).send();
    }
    res.status(200).send(exam);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.updateExam = updateExam;
const deleteExam = async (req, res) => {
  try {
    const exam = await _exam.Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.deleteExam = deleteExam;
const addExaminerToExam = async (req, res) => {
  try {
    const exam = await _exam.Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).send();
    }
    exam.examiners.push(req.body); // Assuming req.body contains examiner data
    await exam.save();
    res.status(200).send(exam);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.addExaminerToExam = addExaminerToExam;
const submitExamAnswers = async (req, res) => {
  try {
    const examId = req.params.id;
    const {
      examinerName,
      answers,
      finish_time
    } = req.body;

    // Validation for request data
    if (!examinerName || !Array.isArray(answers) || !finish_time) {
      return res.status(400).send({
        message: "Missing required fields"
      });
    }
    const exam = await _exam.Exam.findById(examId);
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found"
      });
    }

    // Ensure that the number of submitted answers matches the number of questions
    if (answers.length !== exam.questions.length) {
      return res.status(400).send({
        message: "The number of answers submitted does not match the number of questions"
      });
    }

    // Calculate the score based on the answers (if your backend should handle this)
    let score = 0;
    exam.questions.forEach((question, index) => {
      if (question.answer === answers[index]) {
        score += question.score;
      }
    });

    // Update the exam document with the results and other submission details
    exam.examiners.push({
      name: examinerName,
      score: score
    });
    await exam.save();
    res.status(200).send({
      message: "Exam submitted successfully",
      examId: exam._id,
      score: score
    });
  } catch (error) {
    console.error("Error submitting exam answers:", error);

    // Handling specific error types like Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation error",
        error: error.message
      });
    }

    // Generic error response
    res.status(500).send({
      message: "Failed to submit exam answers",
      error: error.toString()
    });
  }
};

// Add the function to the export list
exports.submitExamAnswers = submitExamAnswers;