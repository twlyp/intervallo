<template>
  <div class="login-component">
    <div v-if="user.id">
      <h2>Logged in as {{ user.name || user.email }}.</h2>
      <b-button to="/training" variant="primary">Go train!</b-button>
    </div>

    <div v-else>
      <h2>Login or register</h2>
      <p>
        An account will be created if you don't have one already. Once you have
        an account we will be able to generate your training plan.
      </p>
      <b-form-group
        v-if="step == 1"
        description="We will only use your e-mail address to send you a one-time password (OTP)."
      >
        <b-form-input v-model="email" type="email" placeholder="Enter email" />
      </b-form-group>

      <b-form-group
        v-if="step == 2"
        description="The OTP will remain valid for 10 minutes. Please check your spam folder!"
      >
        <b-form-input v-model="otp" type="text" placeholder="Enter OTP" />
      </b-form-group>
      <b-button-group>
        <b-button
          :variant="email ? 'primary-outline' : 'primary'"
          @click="getOtp"
        >
          Request OTP
        </b-button>
        <b-button v-if="step == 2" variant="primary" @click="login">
          Login
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
import axios from "../utils/axios";

export default {
  name: "Login",
  props: ["user"],
  data() {
    return {
      email: "",
      otp: "",
      step: 1,
    };
  },
  async beforeMount() {
    // get profile if login cookies already present
    if (!this.user.id) {
      const { data } = await axios.get("/profile");
      if (data.success) return this.$emit("login", data.user);
    }
  },
  methods: {
    async getOtp() {
      const { data } = await axios.post("/login", this.$data);
      if (!data.success) return this.$emit("error", data.error);
      this.step = 2;
    },
    async login() {
      const { data } = await axios.post("/otp", this.$data);
      if (!data.success) return this.$emit("error", data.error);
      this.$emit("login", data.user);
      this.$router.push("/");
    },
  },
};
</script>
