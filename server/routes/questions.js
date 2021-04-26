const router = require("express").Router();
const db = require("../utils/db");

router.post("/questions", (req, res, next) => {
  if (!req.session.userId) return next({ myError: "no_login" });
});
