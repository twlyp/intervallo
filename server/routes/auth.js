const router = require("express").Router();
const ses = require("../utils/ses");
const crs = require("../utils/crypto-random.js");
const db = require("../utils/db");

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  let userId = await db.getUserId({ email });
  if (!userId) return next({ myError: "no_user" });
  const otp = await crs.getCode();
  try {
    await db.addOtp({ userId, otp });
    // !DEBUG await ses.sendEmail(email, otp, "Your Intervallo login code");
    console.log("userId, otp:", userId, otp);
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

router.post("/otp", async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await db.checkOtp({ email });
  if (!user || user.otp != otp) return next({ myError: "bad_otp" });
  delete user.otp;
  req.session.userId = user.id;
  return res.json({ success: true, user });
});

module.exports = router;
