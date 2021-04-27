<template>
  <div class="training-questions">
    <h4>Question {{ step }}/{{ settings.nQuestions }}</h4>
    <b-container fluid>
      <b-row>
        <b-col
          cols="6"
          v-for="(interval, idx) of settings.intervals"
          :key="idx"
        >
          <b-button
            pill
            :variant="
              selectedButton == interval.name ? 'primary' : 'outline-primary'
            "
            @click="answer(interval.name)"
          >
            {{ interval.label }}
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <b-button-group>
      <b-button variant="outline-primary" @click="play">
        Replay sound
      </b-button>
      <b-button variant="outline-primary" @click="stop"> Stop </b-button>
    </b-button-group>

    <b-button-group>
      <b-button variant="outline-primary"> Restart session </b-button>
      <b-button variant="outline-primary"> Change settings </b-button>
      <b-button variant="outline-primary"> Abandon session </b-button>
    </b-button-group>
  </div>
</template>

<script>
import * as Tone from "tone";
import { INTERVALS } from "../constants";

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

  props: ["settings", "receivedQuestions"],
  data() {
    return {
      step: 1,
      questions: [],
      currentInterval: [],
      sequence: null,
      answers: [],
      selectedButton: "",
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
  async beforeMount() {
    // init
    const interval = this.getInterval();
    this.sequence = createSequence(interval);
    await Tone.start();
  },
  mounted() {
    this.play();
  },

  methods: {
    async play() {
      return Tone.Transport.start().stop("+2n");
    },
    stop() {
      Tone.Transport.stop();
    },

    async answer(answer) {
      this.selectedButton = answer;
      const answeredInterval = this.getAnsweredInterval(answer);
      this.updateSequence(answeredInterval);
      await this.play();
      this.selectedButton = "";

      const { name, direction } = this.currentQuestion;
      this.answers.push({ name, direction, answer });
      console.log(`answered ${answer}`);

      if (this.step === this.settings.nQuestions)
        return this.$emit("training-done", this.answers);
      this.step++;

      const newInterval = this.getInterval();
      this.updateSequence(newInterval);
      this.play();
    },

    getQuestions() {
      if (this.receivedQuestions.length != 0) {
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
    updateSequence(array) {
      this.sequence.events = array;
    },
  },
};
</script>
