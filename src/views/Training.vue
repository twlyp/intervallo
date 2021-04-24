<template>
  <div id="interval-training">
    <training-options
      v-if="stage === 'options'"
      @training-settings="startTraining($event)"
    />
    <training-questions
      v-if="stage === 'questions'"
      :settings="settings"
      @reset="reset"
    />
    <training-congrats v-if="stage === 'congrats'" />
  </div>
</template>

<script>
import TrainingOptions from "../components/TrainingOptions";
import TrainingQuestions from "../components/TrainingQuestions";
import TrainingCongrats from "../components/TrainingCongrats";

export default {
  name: "Training",
  components: { TrainingOptions, TrainingQuestions, TrainingCongrats },
  data() {
    return { sessionAnswers: [], stage: "options", settings: {} };
  },
  methods: {
    startTraining(settings) {
      console.log("settings:", settings);
      this.settings = settings;
      this.stage = "questions";
    },
    reset() {
      this.settings = {};
      this.stage = "options";
    },
  },
};
</script>
