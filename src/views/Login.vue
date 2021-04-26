<template>
  <div class="login">
    <h1>This is the login page</h1>
    <div v-if="user.id">
      <h2>Logged in as {{ user.name || user.email }}.</h2>
      <button class="btn btn-primary" @click="goBack">Back</button>
    </div>

    <div v-if="!user.id && step === 1" class="form-group">
      <label for="email">Email address</label>
      <input
        type="email"
        v-model="email"
        class="form-control"
        id="email"
        aria-describedby="emailHelp"
        placeholder="Enter email"
      />
      <small id="emailHelp" class="form-text text-muted"
        >We will use your e-mail only to send you a one-time password
        (OTP).</small
      >
    </div>

    <div v-if="!user.id && step === 2" class="form-group">
      <label for="email">One-time password</label>
      <input
        type="text"
        v-model="otp"
        class="form-control"
        id="otp"
        aria-describedby="otpHelp"
        placeholder="Enter OTP"
      />
      <small id="otpHelp" class="form-text text-muted"
        >The OTP will remain valid for 10 minutes.</small
      >
    </div>

    <button v-if="!user.id" class="btn btn-primary" @click="send">Send</button>
    <!-- <button @click="$emit('something')">emit sth</button> -->
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
  methods: {
    async send() {
      const destination = this.step === 1 ? "/login" : "/otp";
      const { data } = await axios.post(destination, this.$data);
      if (!data.success) return this.$emit("error", data.error);
      if (this.step === 2) {
        this.$emit("login", data.user);
        this.$router.push("/");
      }
      this.step++;
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>
