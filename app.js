var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const server = require("./utils/serverHandler");

require("dotenv").config();

const app = express()
  .use(logger("dev"))
  .get("*", server.serverHandler)
  .post("*", server.serverHandler)
  .put("*", server.serverHandler)
  .delete("*", server.serverHandler);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
