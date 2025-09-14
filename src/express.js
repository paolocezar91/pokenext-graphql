const morgan = require("morgan");
const ENVIRONMENT = process.env.ENVIRONMENT;
const helmet = require("helmet");
const allowedOrigins = process.env.ALLOWED_ORIGINS;
const cors = require("cors");
const express = require("express");

/**
 * Adds logging modules to express app instance
 * @param {Express} app
 */
function logging(app) {
  if (ENVIRONMENT === "sandbox") {
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
  if (ENVIRONMENT !== "sandbox") {
    app.use(helmet()); // Secure HTTP headers
    app.use(cors({ origin: allowedOrigins })); // Restrict CORS
    app.disable("x-powered-by"); // Hide Express info
  }
}

function healthCheck(app) {
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
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
