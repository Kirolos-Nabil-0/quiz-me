"use strict";

var _express = _interopRequireDefault(require("express"));
var _compression = _interopRequireDefault(require("compression"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _morgan = _interopRequireDefault(require("morgan"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var routes = _interopRequireWildcard(require("./routes"));
var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _swaggerDoc = _interopRequireDefault(require("../swaggerDoc.json"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable no-console */

const app = (0, _express.default)();
// database setup
const mongoUri = process && process.env && process.env.MONGODB_URI || "mongodb+srv://kirolos:B7Lf1KHr03VU9jbS@quizer.tizhw7d.mongodb.net/?retryWrites=true&w=majority&appName=quizer" || "mongodb://localhost/mydb";
_mongoose.default.connect(mongoUri, {});
app.use((0, _morgan.default)("dev"));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use((0, _helmet.default)());
app.use((0, _cors.default)());
app.use((0, _compression.default)());
console.log(routes);
app.use("/api", routes.hello);
app.use("/api", routes.exam);
app.use("/api-docs", _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swaggerDoc.default));
module.exports = app;