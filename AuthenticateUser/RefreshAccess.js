var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { refreshKey, accessKey } = require("../AccessFiles/JwtKeys");
var TokenList = require("./TokenList");

var route1 = router.route("/");

//verify refresh token and then generate a new access token
route1.post(async (req, res) => {
  var { token } = req.body;

  jwt.verify(token, refreshKey, (err, result) => {
    //checking if the refresh token is actually in our token list
    if (err || !TokenList.includes(token)) {
      res
        .status(401)
        .json({ status: "failed", message: "unAuthenticated user" });
    } else {
      //the refresh token is valid, so generate a new access token.
      let accessToken = jwt.sign({ email: result.email }, accessKey, {
        expiresIn: "60s",
      });
      res.status(200).json({ status: "success", token: accessToken });
    }
  });
});

module.exports = router;
