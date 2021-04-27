// const RE = {
//   email: /.@./,
//   password: /.{3,}/,
//   code: /[0-9a-f]{6}/,
// };

// const ERRORS = {
//   db_error: "Database error.",
//   db_notfound: "Couldn't find entry in the database.",
//   db_noupdate: "Couldn't update entry in the database.",
//   db_noinsert: "Couldn't add entry in the database.",
//   bad_request: "Invalid request data.",
//   bad_command: "Invalid action.",
//   invalid_password: "Please enter a valid password (at least 3 characters).",
//   invalid_email: "Please enter a valid e-mail.",
//   invalid_name: "First and last name required.",
//   invalid_code: "Please enter a valid verification code (6 digits).",
//   bad_email: "Couldn't find this e-mail in the database.",
//   bad_login: "Invalid username/password combination.",
//   bad_code: "Wrong verification code.",
//   duplicate_email: "E-mail already in use.",
//   pic_nosave: "Couldn't upload file.",
// };

// module.exports = {
//   isLoggedIn: (req, res, next) =>
//     req.session.userId ? next() : res.redirect("/welcome"),

//   isLoggedOut: (req, res, next) =>
//     !req.session.userId ? next() : res.redirect("/"),

//   validate: {
//     name: (req, res, next) => {
//       if (req.body.first && req.body.last) return next();
//       return next({ myCode: "invalid_name" });
//     },
//     email: (req, res, next) => {
//       if (RE.email.test(req.body.email)) return next();
//       return next({ myCode: "invalid_email" });
//     },
//     password: (req, res, next) => {
//       if (RE.password.test(req.body.password)) return next();
//       return next({ myCode: "invalid_password" });
//     },
//     code: (req, res, next) => {
//       if (RE.code.test(req.body.code)) return next();
//       return next({ myCode: "invalid_code" });
//     },
//     file: (req, res, next) =>
//       req.file ? next() : next({ myCode: "pic_nosave" }),
//   },
//   errorHandler: (err, req, res, next) => {
//     if (err.myCode)
//       return res.json({ success: false, error: ERRORS[err.myCode] });
//     console.error(err.stack);
//     return res.json({ success: false, error: err.message });
//   },
// };

function errorHandler(err, req, res, next) {
  const ERRORS = {
    no_user: "Couldn't create user.",
    bad_otp: "Wrong OTP.",
    no_login: "Please log in to use smart training generation.",
  };

  if (err.myError)
    return res.json({ success: false, error: ERRORS[err.myError] });
  // console.error(err.stack);
  // return res.json({ success: false, error: err.message });
  return next(err);
}

async function isLoggedIn(req, res, next) {
  const { userId } = req.session;
  if (!userId) return next({ myError: "no_login" });
  return next();
}

module.exports = { errorHandler, isLoggedIn };
