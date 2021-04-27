<template>
  <div id="interval-training">
    <training-options
      v-if="stage === 'options'"
      @training-settings="startTraining($event)"
    />
    <training-questions
      v-if="stage === 'questions'"
      :settings="settings"
      :receivedQuestions="questions"
      @reset="reset"
      @training-done="submit"
    />
    <training-congrats
      v-if="stage === 'congrats'"
      @reset="reset"
      @restart="restart"
    />
  </div>
</template>

<script>
import TrainingOptions from "../components/TrainingOptions";
import TrainingQuestions from "../components/TrainingQuestions";
import TrainingCongrats from "../components/TrainingCongrats";
import axios from "../utils/axios";

export default {
  name: "Training",
  components: { TrainingOptions, TrainingQuestions, TrainingCongrats },
  props: ["user"],
  data() {
    return {
      sessionAnswers: [],
      stage: "options",
      settings: {},
      questions: [],
    };
  },
  methods: {
    async startTraining(settings) {
      this.settings = settings;
      if (this.user.id) {
        const { data } = await axios.post("/questions", { settings });
        if (!data.success) return this.$emit("error", data.error);
        this.questions = data.questions;
      }
      this.stage = "questions";
    },
    async submit(answers) {
      // TODO actually submit
      if (this.user.id) {
        console.log("submitting answers:", answers);
        const { data } = await axios.post("/answers", { answers });
        if (!data.success) return this.$emit("error", data.error);
      } else {
        console.log("not logged in. answers:", answers);
      }
      this.stage = "congrats";
    },
    reset() {
      this.settings = {};
      this.stage = "options";
    },
    restart() {
      this.stage = "questions";
    },
  },
};
</script>
