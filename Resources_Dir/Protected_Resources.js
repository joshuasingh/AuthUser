var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { accessKey } = require("../AccessFiles/JwtKeys");

//authication middleware.
var auth = (req, res, next) => {
  try {
    var token = req.headers["authorization"].split(" ")[1];
  } catch (e) {
    res.status(401).json({ status: "failed", message: "unAuthenticated user" });
  }

  //verify the access token
  jwt.verify(token, accessKey, (err, result) => {
    if (err) {
      res
        .status(401)
        .json({ status: "failed", message: "unAuthenticated user" });
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
    .status(200)
    .json({ status: "success", message: "access to the resource" });
});

module.exports = router;
