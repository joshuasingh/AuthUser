var mongo = require("mongodb").MongoClient;
var MongoKey = require("../AccessFiles/MongoKeys");

//mongo connection
const withDB = async (operations, res, collectionName) => {
  try {
    const client = await mongo.connect(MongoKey.DBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("AuthServer");
    const collection = db.collection(collectionName);

    await operations(collection, client);
  } catch (err) {
    //console.log("error is in mongo ", res, err);
    res
      .json({
        status: "failed",
        message: "unable to insert Data",
        report: err.toString(),
      })
      .status(400);
  }
};

module.exports = withDB;
