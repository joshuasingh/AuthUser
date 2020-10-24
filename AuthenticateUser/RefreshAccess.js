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
        .json({ status: "failed", message: "unAuthenticated user" })
        .status(401);
    } else {
      //the refresh token is valid, so generate a new access token.
      let accessToken = jwt.sign({ email: result.email }, accessKey, {
        expiresIn: "60s",
      });
      res.json({ status: "success", token: accessToken }).status(200);
    }
  });

  res
    .json({ status: "success", message: "access to the resource" })
    .status(200);
});

module.exports = router;
