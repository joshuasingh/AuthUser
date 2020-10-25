var express = require("express");
var router = express.Router();
var withDB = require("../MongoBridge/MongoConnect");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var route1 = router.route("/");

//setting user info in db
var setUserInfo = (user, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.insertOne(user).then((result, err) => {
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

//checking for unique email
var UniqueEmail = (email, res) => {
  return new Promise((reject, resolve) => {
    withDB(
      (collection, client) => {
        collection.find({ email: email }).toArray((result, err) => {
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

//create new user details..considering the user values are not empty and valid user email
route1.post(async (req, res) => {
  var { user } = req.body;

  const salt = bcrypt.genSaltSync(saltRounds);
  user.password = bcrypt.hashSync(user.password, salt);

  try {
    var dataSet = await UniqueEmail(user.email, res);

    if (dataSet.length !== 0) {
      //user already in the system
      res
        .status(403)
        .json({ status: "failed", message: "User already exists" });
    } else {
      //set user info
      await setUserInfo(user, res);
    }
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: "Unable to create a user",
      report: e,
    });
  }

  res
    .status(200)
    .json({ status: "success", message: "user Successfully created" });
});

module.exports = router;
