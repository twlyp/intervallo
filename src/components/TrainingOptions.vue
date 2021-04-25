<template>
  <div id="training-options" class="container-fluid">
    <h4 class="text-center">Intervals</h4>
    <div class="row">
      <div class="col-sm-3" v-for="(interval, index) in INTERVALS" :key="index">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            :id="interval.label"
            :aria-describedby="`${interval.name} interval`"
            v-model="selected[interval.label]"
          />
          <label class="form-check-label" :for="interval.label">{{
            interval.name
          }}</label>
        </div>
      </div>
    </div>

    <h4 class="text-center">Direction</h4>
    <div class="row">
      <div class="col-sm-4">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="up"
            aria-describedby="ascending interval"
            v-model="directions.up"
          />
          <label class="form-check-label" for="up">ascending</label>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="down"
            aria-describedby="descending interval"
            v-model="directions.down"
          />
          <label class="form-check-label" for="down">descending</label>
        </div>
      </div>
    </div>

    <!-- <div class="col-sm-4">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="together"
            aria-describedby="harmonic interval"
            v-model="direction.together"
          />
          <label class="form-check-label" for="together">harmonic</label>
        </div>
      </div> -->

    <div class="row">
      <div class="col-sm-8">
        <h4>Number of questions</h4>
      </div>
      <div class="col-sm-4">
        <input
          type="text"
          class="form-control"
          aria-describedby="total number of questions"
          v-model="nQuestions"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <button
          class="btn btn-primary"
          @click="$emit('training-settings', configs)"
        >
          Start
        </button>
      </div>
      <div class="col-sm-6">
        <button class="btn btn-default" @click="setDefaults">
          Set defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { INTERVALS } from "../constants";

export default {
  name: "TrainingOptions",
  data() {
    return {
      INTERVALS,
      selected: {},
      directions: { up: false, down: false },
      nQuestions: 10,
    };
  },
  computed: {
    configs() {
      const intervals = [];
      const directions = [];
      const range = ["A2", "E5"]; // TODO implement range selection
      // for (let i in this.selected) this.selected[i] && intervals.push(i);
      for (let i of this.INTERVALS) this.selected[i.label] && intervals.push(i);
      // for (let d in this.directions) this.directions[d] && directions.push(d);
      if (this.directions.up) directions.push(+1);
      if (this.directions.down) directions.push(-1);

      return { intervals, directions, nQuestions: this.nQuestions, range };
    },
  },
  mounted() {
    this.setDefaults();
    // this.$emit("training-settings", this.configs); // !DEBUG
  },
  methods: {
    setDefaults() {
      const intervals = ["M2", "m3", "M3", "P5", "P8"];
      const directions = ["up", "down"];
      for (let i of intervals) this.selected[i] = true;
      for (let d of directions) this.directions[d] = true;
    },
  },
};
</script>

<style lang="scss" scoped>
// #training-options {
// max-width: 600px;
// }
</style>
