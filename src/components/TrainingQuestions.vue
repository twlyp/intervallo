<template>
  <div id="training-questions" class="container-fluid">
    <h4>Question {{ step }}/{{ settings.nQuestions }}</h4>
    <div class="row">
      <div
        class="col-sm-4"
        v-for="(interval, idx) of settings.intervals"
        :key="idx"
      >
        <button class="btn btn-default" @click="answer(interval.label)">
          {{ interval.name }}
        </button>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" @click="play">Play</button>
      <button class="btn btn-default" @click="$emit('reset')">Reset</button>
      <button class="btn btn-default" @click="stop">Stop</button>
    </div>
  </div>
</template>

<script>
import * as Tone from "tone";
// import { INTERVALS } from "../constants";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

const createSequence = (events) => {
  const synth = new Tone.Synth().toDestination();
  const seq = new Tone.Sequence(
    (time, event) => synth.triggerAttackRelease(event, "8n", time),
    events,
    "4n"
  );
  seq.loop = false;
  seq.start(0);
  return seq;
};

export default {
  name: "TrainingQuestions",

  props: ["settings"],
  data() {
    return {
      step: 1,
      questions: [],
      currentInterval: [],
      sequence: null,
      answers: [],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.step - 1];
    },
  },
  created() {
    this.getQuestions();
  },
  beforeMount() {
    const interval = this.getInterval();
    this.sequence = createSequence(interval);
  },
  mounted() {
    this.play();
  },

  methods: {
    async play() {
      await Tone.start();
      // console.log("audio ready");
      Tone.Transport.start().stop("+2n");
    },
    stop() {
      Tone.Transport.stop();
    },
    answer(answer) {
      const { label, direction } = this.currentQuestion;
      this.answers.push({ question: label, direction, answer });
      console.log(`answered ${answer}`);
      if (this.step === this.settings.nQuestions)
        return this.$emit("training-done", this.answers);
      this.step++;
      const newInterval = this.getInterval();
      this.updateSequence(newInterval);
      this.play();
    },
    getQuestions() {
      for (let i = 0; i < this.settings.nQuestions; i++) {
        const interval = randomElement(this.settings.intervals);
        interval.direction = randomElement(this.settings.directions);
        this.questions.push(interval);
      }
    },
    getInterval() {
      const question = this.currentQuestion;
      const noteA = this.getRandomNote();
      const noteB = noteA.transpose(question.direction * question.semitones);
      const interval = [noteA, noteB];
      this.currentInterval = interval;
      return interval;
    },
    getRandomNote() {
      const freqs = this.settings.range.map((el) =>
        Math.round(Tone.Frequency(el).toFrequency())
      );
      return Tone.Frequency(randomInt(...freqs));
    },
    updateSequence(interval) {
      this.sequence.events = interval;
    },
  },
};
</script>
