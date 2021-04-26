const router = require("express").Router();
const db = require("../utils/db");
const { INTERVALS } = require("../constants");

const ANS = [
  { name: "M3", direction: +1, right: 3, wrong: 5 },
  { name: "M3", direction: -1, right: 0, wrong: 7 },
  { name: "P5", direction: +1, right: 7, wrong: 0 },
];

router.post("/questions", async (req, res, next) => {
  const { userId } = req.session;
  if (!userId) return next({ myError: "no_login" });
  const { settings } = req.body;
  const answers = await db.getUserProfile({ userId }).then((user) => {
    return user.answers || [];
  });

  const questions = generateQuestions(answers, settings);
  console.log("questions:", questions);

  return res.json({ success: true, questions });
});

function generateQuestions(answers, { intervals, directions, nQuestions }) {
  // to create the list of possible intervals:
  // for each possible direction take all possible intervals
  // and map their label together with the direction
  const possibleIntervals = [];
  for (let d of directions) {
    const selectedIntervals = intervals.map((el) => ({
      name: el.label,
      direction: d,
    }));
    possibleIntervals.push(...selectedIntervals);
  }

  // calculate probabilities for each possible interval
  for (let i = 0; i < possibleIntervals.length; i++) {
    const el = possibleIntervals[i];
    let [storedAnswer] = answers.filter(
      (ans) => el.name == ans.name && el.direction == ans.direction
    );
    if (!storedAnswer) storedAnswer = { right: 0, wrong: 0 };
    let { right, wrong } = storedAnswer;
    let total = right + wrong;
    let probability = 0;
    // if never got it right, push up probability
    if (right === 0) probability++;
    // if never answered ever, push up probability
    if (wrong === 0) probability++;
    // if answered few times, push up probability (not statistically significant)
    if (total < 20) probability += 0.5;
    // if possible, increase probability by 'wrong' to 'right' ratio
    if (right != 0 && wrong != 0) probability += wrong / right;
    el.probability = probability;
  }

  possibleIntervals.sort((a, b) => a.probability - b.probability);

  const questions = [];
  for (let j = 0; j < nQuestions; j++) {
    const randomIdx = weightedRandom(possibleIntervals);
    questions.push(possibleIntervals[randomIdx]);
  }

  return questions;

  function weightedRandom(array) {
    const probabilities = array.map((el) => el.probability);
    let runningTotal = 0;
    const cumulativeProbabilities = probabilities.map((el) => {
      return (runningTotal += el);
    });
    const randomNumber = Math.random() * runningTotal;
    let result = 0;
    for (let j = 0; j < cumulativeProbabilities.length; j++) {
      const el = cumulativeProbabilities[j];
      if (randomNumber < el) break;
      result = j;
    }
    return result;
  }
}

module.exports = router;
