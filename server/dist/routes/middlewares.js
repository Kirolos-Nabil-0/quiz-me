"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateExamData = exports.fetchExam = exports.errorHandler = void 0;
const validateExamData = (req, res, next) => {
  const {
    name,
    questions,
    duration
  } = req.body;
  if (!name || !Array.isArray(questions) || !duration) {
    return res.status(400).send({
      message: "Missing required fields: name, questions, or duration."
    });
  }
  // Further validation can be added here, such as checking question structure
  next();
};
exports.validateExamData = validateExamData;
const errorHandler = (error, req, res, next) => {
  console.error(error); // Logging the error for debugging purposes
  res.status(500).send({
    message: "An unexpected error occurred."
  });
};
exports.errorHandler = errorHandler;
const fetchExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).send({
        message: "Exam not found."
      });
    }
    req.exam = exam; // Attach the exam to the request object
    next();
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};
exports.fetchExam = fetchExam;