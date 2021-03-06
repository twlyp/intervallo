const router = require("express").Router();
const db = require("../utils/db");

const { isLoggedIn } = require("./middleware");

router.post("/answers", isLoggedIn, async (req, res, next) => {
  const { userId } = req.session;
  const { answers } = req.body;
  try {
    const storedAnswers = await db.getUserProfile({ userId }).then((user) => {
      return user.answers || [];
    });
    answers.forEach((a) => {
      const isCorrect = a.name == a.answer;
      a.right = isCorrect ? 1 : 0;
      a.wrong = isCorrect ? 0 : 1;
      delete a.answer;

      const storedIdx = storedAnswers.findIndex(
        ({ name, direction }) => name == a.name && direction == a.direction
      );
      if (storedIdx < 0) return storedAnswers.push(a);
      storedAnswers[storedIdx].right += a.right;
      storedAnswers[storedIdx].wrong += a.wrong;
    });
    try {
      await db.writeAnswers({ userId, answers: storedAnswers });
      console.log("storedAnswers:", storedAnswers);

      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    req.session = null;
    return next({ myError: "no_login" });
  }
});

module.exports = router;
