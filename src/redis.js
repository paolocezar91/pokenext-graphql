const redis = require("redis");
const DEFAULT_EXPIRATION = 3600;
const EMPTY_DATA_EXPIRATION = 300;

/**
 * @type {ReturnType<redis.createClient>}
 */
let client;

/**
 * Returns an instance of the RedisClient.
 * It creates one the first time it is run.
 * @returns ReturnType<redis.createClient>
 */
function getRedisClient() {
  if (!client) {
    // Use env vars, fallback to Docker Compose defaults
    const redisUrl = process.env.REDIS_URL;
    const redisPassword = process.env.REDIS_PASSWORD;
    const options = { url: redisUrl };
    if (redisPassword) {
      options.password = redisPassword;
    }
    client = redis.createClient(options);
    console.log(`:: Redis - Redis client created. URL: ${redisUrl}`);
    client.on("error", (err) => console.error("Redis Client Error", err));
  }
  return client;
}

/**
 * Reads a key and tries to return the value cached for it.
 * Otherwise runs fallback function.
 * @param {string} redisKey
 * @param {() => any} fallback
 * @returns
 */
async function getCache(redisKey, fallback) {
  const cachedDocument = await client.get(redisKey);
  if (cachedDocument) {
    console.log(":: Redis - Cache hit", redisKey);
    return JSON.parse(cachedDocument);
  }
  console.log(":: Redis - Cache miss", redisKey);
  return await fallback();
}

/**
 * Writes a key-value pair into cache
 * @param {string} redisKey
 * @param {unknown} data
 */
async function setCache(redisKey, data) {
  console.log(":: Redis - Setting cache", redisKey);
  // 5 min for empty, 1 hour for results
  let ttl = DEFAULT_EXPIRATION;
  if (
    (Array.isArray(data) && data.length === 0) ||
    data === "" ||
    data === null ||
    !data
  ) {
    ttl = EMPTY_DATA_EXPIRATION;
  }

  await client.setEx(redisKey, ttl, JSON.stringify(data));
}

module.exports = {
  getRedisClient,
  getCache,
  setCache,
  DEFAULT_EXPIRATION,
};
