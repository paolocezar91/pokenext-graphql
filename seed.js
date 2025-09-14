const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const readline = require("readline");
const dataDir = path.join(__dirname, "./data/api/v2");
// const dataDir = path.join(__dirname, '../pokenext-express/data/api/v2');
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const getIdFromUrlSubstring = (url = "") =>
  url.split("/")[url.split("/").length - 2];

const getResourcesList = (resource, limit = 20, offset = 0) => {
  const indexFile = path.join(dataDir, resource, "index.json");
  const indexData = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  let allResults = indexData.results;
  const totalCount = allResults.length;
  const paginatedResults = allResults.slice(offset, offset + limit);
  return {
    count: paginatedResults.length,
    total_count: totalCount,
    results: paginatedResults,
  };
};

const getResourceById = (resource, id) => {
  const filePath = path.join(dataDir, resource, id, "index.json");
  const response = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return response;
};

function startLoading(message = "") {
  const frames = ["", ".", "..", "...", "...."];
  let i = 0;
  process.stdout.write(message);
  const interval = setInterval(() => {
    process.stdout.write("\r" + message + frames[i++ % frames.length]);
  }, 400);
  return interval;
}

function stopLoading(interval, message = "") {
  clearInterval(interval);
  process.stdout.write("\r" + message + "\n");
}

const acquireDataFromFiles = (resource) => {
  const total_count = getResourcesList(resource, 1).total_count;
  const resourcePage = getResourcesList(resource, total_count);
  const loadingInterval = startLoading(`Loading ${total_count} files...`);
  const resources = resourcePage.results.map((p) =>
    getResourceById(resource, getIdFromUrlSubstring(p.url)),
  );
  stopLoading(loadingInterval, "Files loaded!");
  return resources;
};

// Interactive CLI logic
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptResource() {
  rl.question(
    'Enter resource folder name to seed (or CTRL+C or "q"/"quit" to exit): ',
    async (answer) => {
      const input = answer.trim().toLowerCase();
      if (input === "q" || input === "quit") {
        rl.close();
        return;
      }
      try {
        const resourceDir = path.join(dataDir, answer);
        if (
          fs.existsSync(resourceDir) &&
          fs.readdirSync(resourceDir).length > 0
        ) {
          console.log(`Resource directory located: ${resourceDir}`);
          const resourceData = acquireDataFromFiles(answer);
          await seed(resourceData, answer);
        } else {
          console.log("Resource directory not found or empty.");
        }
      } catch (err) {
        console.error("Error:", err);
      }
      promptResource(); // Ask again
    },
  );
}

promptResource();

async function seed(rd, ra) {
  // --- MongoDB connection and seeding ---
  const loadingInterval = startLoading(`Seeding resources...`);
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    await db.collection(ra).deleteMany({});
    await db.collection(ra).insertMany(rd);
    console.log("Database seeded successfully!");
  } catch (err) {
    stopLoading(loadingInterval, "Seeding error!");
    console.error(err);
  } finally {
    stopLoading(loadingInterval, "Data was seeded!");
    await client.close();
  }
}
