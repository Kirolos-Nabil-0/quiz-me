"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send({
    data: 'Hello from Generate-Express'
  });
});
var _default = exports.default = router;