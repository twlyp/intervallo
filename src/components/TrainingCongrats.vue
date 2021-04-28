<template>
  <div id="training-congrats" class="container-fluid">
    <div class="header">
      <h4>Well done!!</h4>
    </div>

    <b-button-group class="buttons">
      <b-button variant="primary" @click="$emit('restart-training')">
        Restart session
      </b-button>
      <b-button variant="outline-secondary" @click="$emit('change-settings')">
        Change settings
      </b-button>
    </b-button-group>
  </div>
</template>

<script>
export default {
  name: "TrainingCongrats",
};
</script>
