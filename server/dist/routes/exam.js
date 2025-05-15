"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var examController = _interopRequireWildcard(require("../controllers/examControoler.js"));
var _middlewares = require("./middlewares");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const router = _express.default.Router();
router.post("/exams", _middlewares.validateExamData, examController.createExam);
router.get("/exams", examController.getAllExams);
router.get("/exams/:id", examController.getExamById);
router.put("/exams/:id", [_middlewares.fetchExam, _middlewares.validateExamData], examController.updateExam);
router.delete("/exams/:id", examController.deleteExam);
router.post("/exams/:id/examiners", _middlewares.fetchExam, examController.addExaminerToExam);
router.post("/:id/submit", examController.submitExamAnswers);
var _default = exports.default = router;