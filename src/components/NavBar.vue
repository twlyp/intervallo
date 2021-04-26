<template>
  <div id="nav" class="container-fluid">
    <div class="btn-group">
      <router-link to="/" :class="getClasses('Home')">Home</router-link>
      <router-link to="/login" :class="getClasses('Login')">Login</router-link>
      <router-link to="/training" :class="getClasses('Training')"
        >Interval training</router-link
      >
      <button class="btn btn-default" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import axios from "../utils/axios";

export default {
  name: "NavBar",
  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
  methods: {
    getClasses(route) {
      if (this.currentRoute == route) return "btn btn-primary";
      return "btn btn-default";
    },
    async logout() {
      const { data } = await axios.get("/logout");
      if (!data.success) return this.$emit("error", data.error);
      this.$emit("logout");
    },
  },
};
</script>

<style lang="scss" scoped>
// a {
//   &.router-link-exact-active {
//     color: #42b983;
//   }
// }
</style>
