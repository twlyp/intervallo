<template>
  <div id="app">
    <main>
      <b-card title="Card title" no-body>
        <b-card-header header-tag="nav">
          <b-nav card-header tabs fill>
            <b-nav-item to="/" exact exact-active-class="active"
              >Home</b-nav-item
            >
            <b-nav-item to="/login" exact exact-active-class="active"
              >Login</b-nav-item
            >
            <b-nav-item to="/training" exact exact-active-class="active"
              >Interval training</b-nav-item
            >
            <b-nav-item @click="onLogout" :disabled="!user.id"
              >Logout</b-nav-item
            >
          </b-nav>
        </b-card-header>

        <b-card-body id="card-body" class="text-center">
          <router-view @error="onError" @login="onLogin" :user="user" />
        </b-card-body>
      </b-card>
    </main>

    <!-- alerts -->
    <b-alert :show="!!successMsg" variant="success" dismissible fade>
      {{ successMsg }}
    </b-alert>

    <b-alert :show="!!errorMsg" variant="danger" dismissible fade>
      {{ errorMsg }}
    </b-alert>
  </div>
</template>

<script>
const ALERT_DELAY = 5000;

export default {
  name: "App",

  data() {
    return { successMsg: "", errorMsg: "", user: {} };
  },

  methods: {
    onError(err) {
      this.errorMsg = err;
      setTimeout(() => this.clearMsg(), ALERT_DELAY);
    },
    onLogin(userData) {
      this.user = { ...userData };
      this.successMsg = "Login successful.";
      setTimeout(() => this.clearMsg(), ALERT_DELAY);
    },
    onLogout() {
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
body {
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#card-body {
  padding: 3rem 1rem;
}

.header {
  margin: 1rem;
}

.buttons {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

main {
  width: min(100vw, 720px);
  position: absolute;
  padding: 1rem;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
