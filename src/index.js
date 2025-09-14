const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const { getApolloServer } = require("./apollo");
const { getExpressServer } = require("./express");
const { connectToMongo } = require("./mongo");

const PORT = process.env.PORT;
const ENVIRONMENT = process.env.ENVIRONMENT;

async function run() {
  await connectToMongo();
  const server = await getApolloServer();
  await server.start();
  const app = getExpressServer();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `:: Server ready at http://localhost:${PORT}${server.graphqlPath} in ${ENVIRONMENT}`
    );
  });
}
run().catch(console.dir);
