const router = require("express").Router();
const ses = require("../utils/ses");
const crs = require("../utils/crypto-random.js");
const db = require("../utils/db");

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  let userId = await db.getUser({ email });
  if (!userId) return next({ myError: "no_user" });
  const otp = await crs.getCode();
  try {
    await db.addOtp({ userId, otp });
    await ses.sendEmail(email, otp, "Your Intervallo login code");
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

router.post("/otp", async (req, res, next) => {
  const { email, otp } = req.body;
  const userData = await db.getOtp({ email });
  if (!userData || userData.otp != otp) return next({ myError: "bad_otp" });
  req.session.userId = userData.id;
  return res.json({ success: true });
});

module.exports = router;
