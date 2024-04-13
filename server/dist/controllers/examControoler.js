"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExam = exports.getExamById = exports.getAllExams = exports.deleteExam = exports.createExam = exports.addExaminerToExam = void 0;
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