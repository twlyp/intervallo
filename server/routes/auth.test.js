const sinon = require("sinon"),
  chai = require("chai"),
  chaiHttp = require("chai-http"),
  app = require("../server");

chai.use(chaiHttp);
chai.should();
