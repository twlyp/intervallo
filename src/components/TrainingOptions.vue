<template>
  <div class="training-options">
    <b-container fluid>
      <section>
        <b-row>
          <b-col cols="12">
            <h4>Intervals</h4>
          </b-col>
        </b-row>

        <b-row class="text-left">
          <b-col cols="6" v-for="(interval, index) in INTERVALS" :key="index">
            <b-form-checkbox
              v-model="selected[interval.name]"
              :name="interval.name"
            >
              {{ interval.label }}
            </b-form-checkbox>
          </b-col>
        </b-row>
      </section>

      <section>
        <b-row>
          <b-col cols="12">
            <h4>Directions</h4>
          </b-col>
        </b-row>

        <b-row class="text-left">
          <b-col cols="6">
            <b-form-checkbox v-model="directions.up">
              ascending
            </b-form-checkbox>
          </b-col>

          <b-col cols="6">
            <b-form-checkbox v-model="directions.down">
              descending
            </b-form-checkbox>
          </b-col>
        </b-row>
      </section>

      <section id="n-questions">
        <b-row align-v="center">
          <b-col cols="8">
            <h4>Number of questions</h4>
          </b-col>

          <b-col cols="4">
            <b-form-input type="number" v-model="nQuestions" min="1" max="20" />
          </b-col>
        </b-row>
      </section>

      <section>
        <b-row>
          <b-col>
            <b-button-group>
              <b-button
                variant="primary"
                :disabled="!userId"
                @click="$emit('start-magic', configs)"
              >
                Start automagical session
              </b-button>

              <b-button
                variant="outline-primary"
                @click="$emit('start-random', configs)"
              >
                Start random session
              </b-button>

              <b-button variant="outline-primary" @click="setDefaults">
                Reset defaults
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </section>
    </b-container>
  </div>
</template>

<script>
import { INTERVALS } from "../constants";

export default {
  name: "TrainingOptions",

  props: ["receivedSettings", "userId"],
  data() {
    return {
      INTERVALS,
      selected: {},
      directions: { up: false, down: false },
      nQuestions: 0,
    };
  },
  computed: {
    configs() {
      const intervals = [];
      const directions = [];
      const range = ["C3", "C5"]; // TODO implement range selection

      // if interval i is selected push it to the intervals array
      for (let i of this.INTERVALS) this.selected[i.name] && intervals.push(i);

      if (this.directions.up) directions.push(+1);
      if (this.directions.down) directions.push(-1);

      return { intervals, directions, nQuestions: this.nQuestions, range };
    },
  },

  mounted() {
    const { intervals, directions, nQuestions } = this.receivedSettings;
    if (intervals && directions && nQuestions) {
      // if settings have been received from Training import them
      intervals.forEach((i) => (this.selected[i.name] = true));
      if (directions.includes(1)) this.directions.up = true;
      if (directions.includes(-1)) this.directions.down = true;
      this.nQuestions = nQuestions;
    } else {
      this.setDefaults();
    }
    // this.$emit("training-settings", this.configs); // !DEBUG
  },

  methods: {
    setDefaults() {
      const intervals = ["M2", "m3", "M3", "P5", "P8"];
      const directions = ["up", "down"];
      this.selected = {};
      this.directions = { up: false, down: false };
      for (let i of intervals) this.selected[i] = true;
      for (let d of directions) this.directions[d] = true;
      this.nQuestions = 5;
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  margin: 1em 0;
  padding: 0.5em 1em;
  border: 1px solid #33333333;
  border-radius: 1em;
}

h4 {
  text-align: left;
}

#n-questions h4 {
  margin-bottom: 0;
}
</style>
