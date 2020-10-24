var express = require("express");
var router = express.Router();
var withDB = require("../MongoBridge/MongoConnect");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var route1 = router.route("/");

var setUserInfo = (user, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.insertOne(user).then((result, err) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      },
      res,
      "Users"
    );
  });
};

var UniqueEmail = (email, res) => {
  return new Promise((reject, resolve) => {
    withDB(
      (collection, client) => {
        collection.find({ email: email }).toArray((result, err) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
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
    console.log(dataSet);
    if (dataSet.length !== 0) {
      //user already in the system
      res
        .json({ status: "failed", message: "User already exists" })
        .status(200);
    } else {
      //set user info
      await setUserInfo(user, res);
    }
  } catch (e) {
    res
      .json({ status: "failed", message: "Unable to create a user", report: e })
      .status(400);
  }

  res
    .json({ status: "success", message: "user Successfully created" })
    .status(200);
});

module.exports = router;
