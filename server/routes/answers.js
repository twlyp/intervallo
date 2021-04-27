const router = require("express").Router();
const db = require("../utils/db");

const { isLoggedIn } = require("./middleware");

router.post("/questions", isLoggedIn, async (req, res, next) => {
  const { userId } = req.session;
  const { answers } = req.body;
  const storedAnswers = await db.getUserProfile({ userId }).then((user) => {
    return user.answers || [];
  });
  answers.forEach((a) => {
    if (a.name == a.answer) {
      a.right = 1;
      a.wrong = 0;
    } else {
      a.right = 0;
      a.wrong = 1;
    }
    const storedIdx = storedAnswers.findIndex(
      ({ name, direction }) => name == a.name && direction == a.direction
    );
    if (storedIdx < 0) return storedAnswers.push(a);
    storedAnswer[storedIdx].right += a.right;
    storedAnswer[storedIdx].wrong += a.wrong;
  });
});

module.exports = router;
