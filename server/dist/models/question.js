"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.questionSchema = exports.Question = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const questionSchema = exports.questionSchema = new _mongoose.default.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  score: {
    type: Number,
    default: 1
  }
});
const Question = exports.Question = _mongoose.default.model("Question", questionSchema);

// Path: server/models/question.js