<template>
  <b-nav card-header tabs fill>
    <b-nav-item to="/" exact exact-active-class="active">Home</b-nav-item>
    <b-nav-item to="/login" exact exact-active-class="active">Login</b-nav-item>
    <b-nav-item to="/training" exact exact-active-class="active">
      Train
    </b-nav-item>
    <b-nav-item @click="logout">Logout</b-nav-item>
  </b-nav>
</template>

<script>
import axios from "../utils/axios";

export default {
  name: "NavBar",

  methods: {
    async logout() {
      const { data } = await axios.get("/logout");
      if (!data.success) return this.$emit("error", data.error);
      this.$emit("logout");
    },
  },
};
</script>

<style lang="scss" scoped></style>
