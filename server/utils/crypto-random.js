const cryptoRandomString = require("crypto-random-string");

module.exports.getCode = () =>
  cryptoRandomString({
    length: 6,
  });
