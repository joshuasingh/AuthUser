var express = require("express");
var router = express.Router();
var withDB = require("../MongoBridge/MongoConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { refreshKey, accessKey } = require("../AccessFiles/JwtKeys");
var TokenList = require("./TokenList");

var route1 = router.route("/");

var verifyUser = (email, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.find({ email: email }).toArray((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      },
      res,
      "Users"
    );
  });
};

//generate access and refresh tokens
var generateTokens = (user) => {
  //access token expires in 1 hour
  let accessToken = jwt.sign({ email: user.email }, accessKey, {
    expiresIn: "60s",
  });

  //refresh token expires in 7 days
  let refreshToken = jwt.sign({ email: user.email }, refreshKey, {
    expiresIn: "5d",
  });

  //add refresh token to the list
  TokenList.push(refreshToken);

  return { accessToken, refreshToken };
};

//verify the username and password and then generate refresh and access token
route1.post(async (req, res) => {
  var { user } = req.body;
  var authStat = false;
  var statusMessage = "";
  try {
    var userDetails = await verifyUser(user.email, res);

    //if the email is present in the database
    if (userDetails.length !== 0) {
      const match = await bcrypt.compare(
        user.password,
        userDetails[0].password
      );

      //if the password hash matches
      if (match) {
        var { accessToken, refreshToken } = generateTokens(user);
        authStat = true;
        statusMessage = "user Logged In";
      } else {
        //if the password hash doesn't matches
        statusMessage = "Incorrect email or password ";
      }
    } else {
      //if nothing found in the database.
      statusMessage = "Incorrect email or password ";
    }
  } catch (e) {
    res
      .status(500)
      .json({ status: "failed", message: "unable to login", report: e });
  }

  if (authStat) {
    res.status(200).json({
      status: "success",
      message: statusMessage,
      token: { accessToken: accessToken, refreshToken: refreshToken },
    });
  } else {
    res.status(401).json({ status: "failed", message: statusMessage });
  }
});

module.exports = router;
