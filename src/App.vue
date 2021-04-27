<template>
  <div id="app">
    <div
      v-if="successMsg"
      class="alert alert-success"
      role="alert"
      @click="clearMsg"
    >
      {{ successMsg }}
    </div>
    <div
      v-if="errorMsg"
      class="alert alert-danger"
      role="alert"
      @click="clearMsg"
    >
      {{ errorMsg }}
    </div>
    <nav-bar @logout="handleLogout" />
    <router-view
      @something="doSomething"
      @error="handleError"
      @login="handleLogin"
      :user="user"
    />
  </div>
</template>

<script>
import NavBar from "./components/NavBar";

const ALERT_DELAY = 5000;

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return { successMsg: "", errorMsg: "", user: {} };
  },
  methods: {
    doSomething() {
      console.log("doing something");
    },
    handleError(err) {
      this.errorMsg = err;
      setTimeout(() => this.clearMsg(), ALERT_DELAY);
    },
    handleLogin(userData) {
      this.user = { ...userData };
      this.successMsg = "Login successful.";
      setTimeout(() => this.clearMsg(), ALERT_DELAY);
    },
    handleLogout() {
      this.user = {};
      this.successMsg = "Logout successful.";
      setTimeout(() => this.clearMsg(), ALERT_DELAY);
    },
    clearMsg() {
      this.errorMsg = "";
      this.successMsg = "";
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
