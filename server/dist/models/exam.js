"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.examSchema = exports.Exam = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _question = require("./question.js");
var _examiner = require("./examiner.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const examSchema = exports.examSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  questions: {
    type: [_question.questionSchema],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  examiners: {
    type: [_examiner.Examiner.schema],
    default: []
  }
});
const Exam = exports.Exam = _mongoose.default.model("Exam", examSchema);

// Path: server/models/question.js