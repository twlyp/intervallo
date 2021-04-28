<template>
  <div class="training-questions">
    <b-container fluid>
      <!-- headline -->
      <b-row class="header">
        <b-col>
          <h2>Question {{ step }}/{{ settings.nQuestions }}</h2>
        </b-col>
      </b-row>

      <!-- interval buttons -->
      <b-row class="buttons">
        <b-col
          cols="4"
          v-for="(interval, idx) of settings.intervals"
          :key="idx"
        >
          <b-button
            pill
            variant="outline-primary"
            :id="interval.name"
            @click="onClick"
            class="my-1"
          >
            {{ interval.label }}
          </b-button>
        </b-col>
      </b-row>

      <!-- play/stop buttons -->
      <b-row class="buttons">
        <b-col>
          <b-button-group>
            <b-button variant="outline-primary" @click="play">
              Replay sound
            </b-button>
            <b-button variant="outline-primary" @click="stop"> Stop </b-button>
          </b-button-group>
        </b-col>
      </b-row>

      <!-- session buttons -->
      <b-row class="buttons">
        <b-col>
          <b-button-group>
            <b-button variant="info" @click="restartSession">
              Restart session
            </b-button>
            <b-button variant="outline-secondary" @click="changeSettings">
              Change settings
            </b-button>
            <b-button variant="outline-danger" @click="endSession">
              End session
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as Tone from "tone";
import { INTERVALS } from "../constants";
import { sequence } from "../views/Training";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

export default {
  name: "TrainingQuestions",

  props: ["settings", "receivedQuestions"],
  data() {
    return {
      step: 1,
      questions: [],
      currentInterval: [],
      answers: [],
      selectedButton: "",
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.step - 1];
    },
  },

  beforeMount() {
    this.getQuestions();
  },

  async mounted() {
    const interval = this.getInterval();
    sequence.events = interval;
    await Tone.start();
    this.play();
  },

  methods: {
    play() {
      Tone.Transport.stop();
      Tone.Transport.start();
    },
    stop() {
      Tone.Transport.stop();
    },

    getQuestions() {
      if (this.receivedQuestions.length > 0) {
        this.questions = this.receivedQuestions;
        this.questions.forEach((el) => {
          const intervalData = INTERVALS.find((i) => i.name == el.name);
          el.semitones = intervalData.semitones;
        });
      } else {
        for (let i = 0; i < this.settings.nQuestions; i++) {
          const interval = randomElement(this.settings.intervals);
          interval.direction = randomElement(this.settings.directions);
          this.questions.push(interval);
        }
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
    getAnsweredInterval(interval) {
      const { semitones } = INTERVALS.find((i) => i.name == interval);
      const noteA = this.currentInterval[0];
      const noteB = noteA.transpose(this.currentQuestion.direction * semitones);
      return [noteA, noteB];
    },
    getRandomNote() {
      const freqs = this.settings.range.map((el) =>
        Math.round(Tone.Frequency(el).toFrequency())
      );
      return Tone.Frequency(randomInt(...freqs));
    },

    restartSession() {
      return this.$emit("restart-training", this.answers);
    },
    changeSettings() {
      return this.$emit("change-settings", this.answers);
    },
    endSession() {
      return this.$emit("training-done", this.answers);
    },

    onClick(e) {
      const answer = e.target.id;
      e.target.classList.replace("btn-outline-primary", "btn-primary");
      const answeredInterval = this.getAnsweredInterval(answer);
      sequence.events = answeredInterval;
      this.play();
      Tone.Transport.scheduleOnce(() => {
        e.target.classList.replace("btn-primary", "btn-outline-primary");
        this.answer(answer);
      }, "+1n");
    },

    async answer(answer) {
      const { name, direction } = this.currentQuestion;
      this.answers.push({ name, direction, answer });
      console.log(`answered ${answer}`);

      if (this.step == this.settings.nQuestions) {
        this.endSession();
      } else {
        this.step++;

        const newInterval = this.getInterval();
        sequence.events = newInterval;
        this.play();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
