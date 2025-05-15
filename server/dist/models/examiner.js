"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.examinerSchema = exports.Examiner = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const examinerSchema = exports.examinerSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  finish_time: {
    // set the defult to curernt timeStamp
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    required: true
  }
});
const Examiner = exports.Examiner = _mongoose.default.model("Examiner", examinerSchema);

// Path: server/models/examiner.js