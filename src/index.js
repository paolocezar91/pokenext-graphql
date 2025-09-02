
const dotenv = require('dotenv');
dotenv.config({ path: "./.env"});
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const depthLimit = require('graphql-depth-limit');
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;
const ENVIRONMENT = process.env.ENVIRONMENT;
const allowedOrigins = process.env.ALLOWED_ORIGINS;
const {resolvers, typeDefs} = require('./resolvers');

const clientOptions = {
  dbName: DB_NAME,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

async function run() {
    await mongoose.connect(MONGO_URL, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const app = express();
    if(ENVIRONMENT === 'sandbox') {
      app.use(morgan())
    }
    if(ENVIRONMENT !== 'sandbox') {
      app.use(helmet()); // Secure HTTP headers
      app.use(cors({ origin: allowedOrigins })); // Restrict CORS
    }

    app.disable('x-powered-by'); // Hide Express info

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: ENVIRONMENT !== 'production', // Disable introspection in prod
      validationRules: [
        depthLimit(7), // Limit query depth
        createComplexityLimitRule(30000, {
          onCost: (cost) => { console.log('Query cost:', cost); },
          formatErrorMessage: cost => `Query is too complex: ${cost}`
        })
      ],
      context: ({ req }) => {
        // Add authentication info here
        return { user: req.user };
      }
    });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath} in ${ENVIRONMENT}`);
    });
}
run().catch(console.dir);