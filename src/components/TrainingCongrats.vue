<template>
  <div id="training-congrats" class="container-fluid">
    <h4>Well done!!</h4>

    <div class="btn-group">
      <button class="btn btn-primary" @click="$emit('restart')">Restart</button>
      <button class="btn btn-default" @click="$emit('reset')">Reset</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingCongrats",
};
</script>
