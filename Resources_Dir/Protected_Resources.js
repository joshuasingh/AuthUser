var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { refreshKey, accessKey } = require("../AccessFiles/JwtKeys");

//authication middleware.
var auth = (req, res, next) => {
  var token = req.headers["authorization"].split(" ")[1];

  //verify the access token
  jwt.verify(token, accessKey, (err, result) => {
    if (err) {
      res
        .json({ status: "failed", message: "unAuthenticated user" })
        .status(401);
    } else {
      req.user = result;
      next();
    }
  });
};
router.use(auth);
var route1 = router.route("/");

//api to show the access to the protected resources
route1.post((req, res) => {
  res
    .json({ status: "success", message: "access to the resource" })
    .status(200);
});

module.exports = router;
