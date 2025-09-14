const { resolvers, typeDefs } = require("./resolvers");
const { createComplexityLimitRule } = require("graphql-validation-complexity");
const depthLimit = require("graphql-depth-limit");
const { ApolloServer } = require("apollo-server-express");
const ENVIRONMENT = process.env.ENVIRONMENT;
const { getRedisClient } = require("./redis");
// const jwt = require("jsonwebtoken");

/**
 * Creates an Apollo server instace with typeDefs, resolvers and configuration
 * @returns {Promise<ApolloServer<ExpressContext>>}
 */
async function getApolloServer() {
  const redis = getRedisClient();
  await redis.connect();

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: ENVIRONMENT !== "production",
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
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      console.log({ token });

      // return { userId: jwt.decode(token) }
      return { userId: token }; // You may want to verify the JWT here and extract the user ID
    },
  });

  console.log(":: Apollo - Apollo server created.");
  return apollo;
}

module.exports = {
  getApolloServer,
};
