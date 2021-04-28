<template>
  <div id="training-rehearsal">
    <b-container fluid>
      <b-row>
        <b-col class="header">
          <h4>Get a feeling for the intervals first</h4>
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

      <b-row class="buttons">
        <b-col>
          <b-button variant="primary" @click="$emit('rehearsal-done')">
            Ready
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as Tone from "tone";
import { sequence } from "../views/Training";
import { INTERVALS } from "../constants";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default {
  name: "TrainingRehearsal",
  props: ["settings"],
  data() {
    return { rootNote: null };
  },
  computed: {
    intervals() {
      const result = {};
      if (this.rootNote) {
        const intervalNames = this.settings.intervals.map((i) => i.name);
        intervalNames.forEach((i) => {
          const { semitones } = INTERVALS.find((el) => el.name == i);
          const noteA = this.rootNote;
          const noteB = noteA.transpose(semitones);
          result[i] = [noteA, noteB];
        });
      }
      return result;
    },
  },
  async beforeMount() {
    this.rootNote = this.getRandomNote();
    await Tone.start();
  },
  methods: {
    getRandomNote() {
      const freqs = this.settings.range.map((el) =>
        Math.round(Tone.Frequency(el).toFrequency())
      );
      return Tone.Frequency(randomInt(...freqs));
    },
    onClick(e) {
      Tone.Transport.stop();
      sequence.events = this.intervals[e.target.id];
      Tone.Transport.start();
    },
  },
};
</script>
