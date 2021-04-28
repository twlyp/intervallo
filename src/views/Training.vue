<template>
  <div class="training-component">
    <training-options
      v-if="stage === 'options'"
      :receivedSettings="settings"
      :userId="user.id"
      @start-magic="onStartMagic($event)"
      @start-random="onStartRandom($event)"
    />

    <training-rehearsal
      v-if="stage === 'rehearsal'"
      :settings="settings"
      @rehearsal-done="onRehearsalDone"
    />

    <training-questions
      v-if="stage === 'questions'"
      :settings="settings"
      :receivedQuestions="questions"
      @restart-training="onRestartTraining"
      @change-settings="onChangeSettings"
      @training-done="onTrainingDone($event)"
    />

    <training-congrats
      v-if="stage === 'congrats'"
      @restart-training="onRestartTraining"
      @change-settings="onChangeSettings"
    />
  </div>
</template>

<script>
import TrainingOptions from "../components/TrainingOptions";
import TrainingQuestions from "../components/TrainingQuestions";
import TrainingCongrats from "../components/TrainingCongrats";
import TrainingRehearsal from "../components/TrainingRehearsal";
import axios from "../utils/axios";

import * as Tone from "tone";

const synth = new Tone.Synth().toDestination();
const sequence = new Tone.Sequence(
  (time, event) => synth.triggerAttackRelease(event, "8n", time),
  [],
  "4n"
);
sequence.loop = false;
sequence.start(0);

export { synth, sequence };

export default {
  name: "Training",
  components: {
    TrainingOptions,
    TrainingQuestions,
    TrainingCongrats,
    TrainingRehearsal,
  },
  props: ["user"],
  data() {
    return {
      stage: "options",
      settings: {},
      questions: [],
    };
  },
  methods: {
    async getQuestions() {
      const settings = this.settings;
      const { data } = await axios.post("/questions", { settings });
      if (data.success) {
        this.questions = data.questions;
      } else {
        this.$emit("error", data.error);
      }
    },

    async onStartMagic(settings) {
      this.settings = settings;
      if (this.user.id) await this.getQuestions();
      this.stage = "rehearsal";
    },
    onStartRandom(settings) {
      this.settings = settings;
      this.stage = "rehearsal";
    },
    async onRestartTraining() {
      console.log("restarting");
      this.stage = "rehearsal";
      if (this.user.id) {
        await this.getQuestions();
      } else {
        this.questions = [];
      }
    },
    onRehearsalDone() {
      this.stage = "questions";
    },
    onChangeSettings() {
      this.stage = "options";
    },
    async onTrainingDone(answers) {
      if (this.user.id) {
        this.submit(answers);
      } else {
        console.log("not logged in. answers:", answers);
      }
      this.stage = "congrats";
    },

    async submit(answers) {
      console.log("submitting answers:", answers);
      const { data } = await axios.post("/answers", { answers });
      if (!data.success) return this.$emit("error", data.error);
    },
  },
};
</script>
