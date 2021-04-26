const express = require("express"),
  path = require("path"),
  csurf = require("csurf"),
  cookieSession = require("cookie-session"),
  morgan = require("morgan"),
  compression = require("compression");

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
  compression()
  // require("csurf")(),
  // (req, res, next) => {
  //   res.cookie("mytoken", req.csrfToken());
  //   return next();
  // }
);

app.use(require("./routes/auth"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const ERRORS = { no_user: "Couldn't create user.", bad_otp: "Wrong OTP." };

  if (err.myCode)
    return res.json({ success: false, error: ERRORS[err.myCode] });
  // console.error(err.stack);
  // return res.json({ success: false, error: err.message });
  return next(err);
});

app.listen(process.env.PORT || 8080, () => console.log("listening..."));

module.exports = app;
