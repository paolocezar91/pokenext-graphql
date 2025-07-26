const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const dataDir = path.join(__dirname, '../data/api/v2');

const getIdFromUrlSubstring = (url = '') => url.split("/")[url.split("/").length - 2];

const getResourcesList = (resource, limit = 20, offset = 0) => {
    const indexFile = path.join(dataDir, resource, 'index.json');
    const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    let allResults = indexData.results;
    const totalCount = allResults.length;
    const paginatedResults = allResults.slice(offset, offset + limit);
    return {
        count: paginatedResults.length,
        total_count: totalCount,
        results: paginatedResults
    };
};

const getResourceById = (resource, id) => {
    const filePath = path.join(dataDir, resource, id, 'index.json');
    const response = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`Resource id ${id} located: ${response.name}`);
    return response;
};

const acquireDataFromFiles = (resource) => {
    const total_count = getResourcesList(resource, 1).total_count;
    const resourcePage = getResourcesList(resource, total_count);
    return resourcePage.results.map(p => getResourceById(resource, getIdFromUrlSubstring(p.url)));
};

async function seed(rd) {
    // --- MongoDB connection and seeding ---
    const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://pcezar87:mo2z05X9zYH5gvv6@cluster0.mcibv01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const DB_NAME = process.env.DB_NAME || 'pokenext';
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        // Insert users
        await db.collection('users').deleteMany({});
        await db.collection('users').insertMany([
            { email: "user1@example.com" },
            { email: "user2@example.com" }
        ]);
        // Insert pokemon
        await db.collection(resourceArg).deleteMany({});
        await db.collection(resourceArg).insertMany(rd);
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await client.close();
    }
}

const resourceArg = process.argv[2];
console.log(`Resource selected: ${resourceArg}`);
const resourceDir = path.join(dataDir, resourceArg);
if(fs.readdirSync(resourceDir)) {
    console.log(`Resource directory located: ${resourceDir}`);
    const resourceData = acquireDataFromFiles(resourceArg)
    seed(resourceData);
}

