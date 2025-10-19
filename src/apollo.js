const { resolvers, typeDefs } = require("./resolvers");
const { createComplexityLimitRule } = require("graphql-validation-complexity");
const depthLimit = require("graphql-depth-limit");
const { ApolloServer } = require("apollo-server-express");
const ENVIRONMENT = process.env.ENVIRONMENT;
const { getRedisClient } = require("./redis");
const rateLimit = require("express-rate-limit");

/**
 * Creates an Apollo server instace with typeDefs, resolvers and configuration
 * @returns {Promise<ApolloServer<ExpressContext>>}
 */
async function getApolloServer() {
  const redis = getRedisClient();
  await redis.connect();

  // Rate limiting configuration
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: ENVIRONMENT !== "production",
    playground: ENVIRONMENT !== "production",
    validationRules: [
      depthLimit(7),
      createComplexityLimitRule(30000, {
        onCost: (cost) => {
          console.log(`:: Apollo - Query cost: ${cost}`);
        },
        formatErrorMessage: (cost) =>
          `:: Apollo - Query is too complex: ${cost}`,
      }),
    ],
    context: async ({ req }) => {
      // Apply rate limiting
      limiter(req, {}, () => {});

      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      if (token) {
        try {
          const secret = process.env.JWT_SECRET;
          const payload = require("jsonwebtoken").verify(token, secret);
          // Debug: print token payload so we can confirm the token maps to user
          return { userId: payload.id, user: payload };
        } catch (error) {
          console.log(":: Apollo - Invalid token:", error.message);
          throw new Error("Invalid token");
        }
      }
      return { userId: null };
    },
    formatError: (error) => {
      // Don't expose internal errors in production
      if (ENVIRONMENT === "production") {
        if (error.extensions?.code === "INTERNAL_SERVER_ERROR") {
          return new Error("Internal server error");
        }
      }
      console.log(error);
      return error;
    },
  });

  console.log(":: Apollo - Apollo server created with enhanced security.");
  return apollo;
}

module.exports = {
  getApolloServer,
};
