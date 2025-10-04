const morgan = require("morgan");
const ENVIRONMENT = process.env.ENVIRONMENT;
const helmet = require("helmet");
const allowedOrigins = process.env.ALLOWED_ORIGINS;
const cors = require("cors");
const express = require("express");
const { getRedisClient } = require("./redis");

/**
 * Adds logging modules to express app instance
 * @param {Express} app
 */
function logging(app) {
  if (ENVIRONMENT === "local") {
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );
  }
}

/**
 * Adds security modules to express app instance
 * @param {Express} app
 */
function security(app) {
  // If the app is running behind a reverse proxy (for example: nginx, a load
  // balancer or a platform proxy like Heroku), Express must be told to trust
  // the proxy so that `req.ip` and `req.ips` are populated from the
  // `X-Forwarded-*` headers. express-rate-limit validates the presence of
  // `X-Forwarded-For` and will throw a ValidationError unless `trust proxy`
  // is enabled when those headers are present.
  //
  // Control this with the TRUST_PROXY env var (set to "1" or "true") or it
  // will be enabled automatically in production.
  const trustProxy = process.env.TRUST_PROXY;
  if (trustProxy === "1" || trustProxy === "true") {
    // Trust the first proxy in front of the app. If you have multiple proxy
    // hops you can set a number instead (e.g. 2).
    app.set("trust proxy", 2);
  } else if (ENVIRONMENT === "test") {
    // Default to trusting one proxy in production deployments.
    app.set("trust proxy", 2);
  }

  if (ENVIRONMENT !== "local") {
    app.use(helmet()); // Secure HTTP headers
    app.use(cors({ origin: allowedOrigins })); // Restrict CORS
    app.disable("x-powered-by"); // Hide Express info
  }
}

function healthCheck(app) {
  // Enhanced health endpoint that checks downstream services:
  // - MongoDB (via mongoose connection ping)
  // - Redis (via client.ping())
  // - Apollo (app.locals.apolloReady flag set by startup code)
  app.get("/health", async (req, res) => {
    const result = { status: "ok", services: {} };

    // MongoDB
    try {
      const { mongoose } = require("./mongo");
      const state = mongoose.connection.readyState; // 1 = connected
      if (state === 1) {
        result.services.mongodb = { status: "ok" };
      } else {
        // attempt a ping if not marked connected
        try {
          await mongoose.connection.db.admin().command({ ping: 1 });
          result.services.mongodb = { status: "ok" };
        } catch (err) {
          result.services.mongodb = { status: "error", message: err.message };
          result.status = "degraded";
        }
      }
    } catch (err) {
      result.services.mongodb = { status: "error", message: err.message };
      result.status = "degraded";
    }

    // Redis
    try {
      const client = getRedisClient();
      if (client && client.isOpen) {
        try {
          const pong = await client.ping();
          if (pong && (pong === "PONG" || pong === "OK")) {
            result.services.redis = { status: "ok" };
          } else {
            result.services.redis = {
              status: "error",
              message: `unexpected response: ${pong}`,
            };
            result.status = "degraded";
          }
        } catch (err) {
          result.services.redis = { status: "error", message: err.message };
          result.status = "degraded";
        }
      } else {
        // client not created or not open yet
        result.services.redis = { status: "unavailable" };
        result.status = "degraded";
      }
    } catch (err) {
      result.services.redis = { status: "error", message: err.message };
      result.status = "degraded";
    }

    // Apollo
    try {
      const apolloReady = app.locals && app.locals.apolloReady;
      if (apolloReady) {
        result.services.apollo = { status: "ok" };
      } else {
        result.services.apollo = { status: "starting" };
        result.status = "degraded";
      }
    } catch (err) {
      result.services.apollo = { status: "error", message: err.message };
      result.status = "degraded";
    }

    const statusCode = result.status === "ok" ? 200 : 503;
    res.status(statusCode).json(result);
  });
}

/**
 * Creates an Express server, attach logging and security module
 * @returns Express
 */
function getExpressServer() {
  const app = express();
  logging(app);
  security(app);
  healthCheck(app);
  return app;
}

module.exports = {
  getExpressServer,
};
