const DB_NAME = process.env.DB_NAME;
const MONGO_URL = process.env.MONGO_URL;
const mongoose = require("mongoose");

const clientOptions = {
  dbName: DB_NAME,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

async function connectToMongo() {
  await mongoose.connect(MONGO_URL, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log(
    ":: MongoDB - Pinged your deployment. You successfully connected to MongoDB!"
  );
}

module.exports = {
  connectToMongo,
};
