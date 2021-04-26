var crypto = require("crypto");

module.exports = {
  generateOtp: () =>
    crypto.randomBytes(48, function (err, buffer) {
      var token = buffer.toString("hex");
      if (err) throw new Error(err);
      return token;
    }),
};
