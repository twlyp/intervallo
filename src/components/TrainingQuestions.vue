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
    </div>
  </div>
</template>

<script>
import * as Tone from "tone";
// import { INTERVALS } from "../constants";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default {
  name: "TrainingQuestions",
  props: ["settings"],
  data() {
    return { step: 1, questions: [] };
  },
  computed: {
    frequencyRange() {
      return [
        Tone.Frequency(this.settings.range[0]),
        Tone.Frequency(this.settings.range[1]),
      ];
    },
  },
  mounted() {
    this.getQuestions();
  },
  methods: {
    async play() {
      await Tone.start();
      console.log("audio ready");
    },
    answer(label) {
      console.log(`answered ${label}`);
    },
    getQuestions() {
      for (let i = 0; i < this.settings.nQuestions; i++) {
        const intervals = this.settings.intervals;
        const randomIdx = randomInt(0, intervals.length - 1);
        this.questions.push(intervals[randomIdx]);
      }
    },
  },
};
</script>
