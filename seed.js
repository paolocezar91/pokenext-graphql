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

// gets all arguments as resources
const resourcesArg = process.argv.slice(2);

// and seed all of them
resourcesArg.forEach(resourceArg => {
    console.log(`Resource selected: ${resourceArg}`);
    const resourceDir = path.join(dataDir, resourceArg);
    if(fs.readdirSync(resourceDir)) {
        console.log(`Resource directory located: ${resourceDir}`);
        const resourceData = acquireDataFromFiles(resourceArg)
        seed(resourceData, resourceArg);
    }
})

async function seed(rd, ra) {
    // --- MongoDB connection and seeding ---
    const MONGO_URL = process.env.MONGO_URL;
    const DB_NAME = process.env.DB_NAME;
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        await db.collection(ra).deleteMany({});
        await db.collection(ra).insertMany(rd);
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await client.close();
    }
}