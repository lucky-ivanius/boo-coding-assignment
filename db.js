const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();
  const databaseName = "test";

  await mongoose.connect(`${uri}${databaseName}`);

  console.log("MongoDB URI:", uri);
};
