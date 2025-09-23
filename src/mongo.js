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
  try {
    await mongoose.connect(MONGO_URL, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      `:: MongoDB - Pinged your deployment at ${MONGO_URL}. You successfully connected to MongoDB!`
    );
  } catch (error) {
    console.error(":: MongoDB - Connection failed:", error.message);
    throw error;
  }
}

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error(":: MongoDB - Connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log(":: MongoDB - Disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = {
  connectToMongo,
  mongoose,
};
