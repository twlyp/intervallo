const express = require("express"),
  path = require("path"),
  csurf = require("csurf"),
  cookieSession = require("cookie-session"),
  morgan = require("morgan"),
  compression = require("compression");

const { errorHandler } = require("./routes/middleware");

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  }),
  express.json(),
  express.static(path.join(__dirname, "..", "dist")),
  cookieSession({
    secret:
      process.env.SESSION_SECRET ||
      "trentatré trentini entrarono a trento tutti e trentatré trotterellando",
    maxAge: 1000 * 60 * 60 * 24 * 14,
  }),
  morgan("tiny"),
  compression(),
  csurf(),
  (req, res, next) => {
    res.cookie("mytoken", req.csrfToken());
    return next();
  }
);

app.use(require("./routes/auth"));
app.use(require("./routes/questions"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log("listening..."));

module.exports = app;
