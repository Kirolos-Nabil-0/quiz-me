// controllers/examController.js
import { Exam } from "../models/exam";

const createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).send(exam);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).send(exams);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).send();
    }
    res.status(200).send(exam);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!exam) {
      return res.status(404).send();
    }
    res.status(200).send(exam);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const addExaminerToExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
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

export {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  addExaminerToExam,
};
