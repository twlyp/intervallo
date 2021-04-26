import axios from "axios";

const instance = axios.create({
  xsrfCookieName: "mytoken",
  xsrfHeaderName: "csrf-token",
});

export default instance;
