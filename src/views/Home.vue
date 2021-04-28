<template>
  <div class="home">
    <div class="header">
      <h1>Intervallo</h1>
      <h4>Ear training without the frustration.</h4>
    </div>

    <b-button-group class="button-group" vertical size="lg">
      <b-button to="/login" variant="outline-primary">Login</b-button>
      <b-button to="/training" variant="primary">Start training</b-button>
    </b-button-group>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>

<style lang="scss" scoped>
.button-group {
  margin: 2rem;
}
</style>
