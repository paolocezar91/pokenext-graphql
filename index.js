const dotenv= require('dotenv');
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { userTypeDefs, userResolvers } = require('./resolvers/user/user.resolver');
const { userSettingsTypeDefs, userSettingsResolvers } = require('./resolvers/user/user-settings.resolver');
const { pokemonTypeDefs, pokemonResolvers } = require('./resolvers/poke-api/pokemon.resolver');
const { pokemonSpeciesTypeDefs, pokemonSpeciesResolvers } = require('./resolvers/poke-api/pokemon-species.resolver');
const { typesTypeDefs, typesResolvers } = require('./resolvers/poke-api/types.resolver');
const { movesTypeDefs, movesResolvers  } = require('./resolvers/poke-api/moves.resolver');
const { evolutionChainResolvers, evolutionChainTypeDefs } = require('./resolvers/poke-api/evolution-chain.resolver');
const { abilitiesResolvers, abilitiesTypeDefs } = require('./resolvers/poke-api/ability.resolver');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: DB_NAME,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

async function run() {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(MONGO_URL, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const typeDefs = [
      userTypeDefs,
      userSettingsTypeDefs,
      pokemonTypeDefs,
      pokemonSpeciesTypeDefs,
      typesTypeDefs,
      movesTypeDefs,
      evolutionChainTypeDefs,
      abilitiesTypeDefs
    ];

    const resolvers = [
      userResolvers,
      userSettingsResolvers,
      pokemonResolvers,
      pokemonSpeciesResolvers,
      typesResolvers,
      movesResolvers,
      evolutionChainResolvers,
      abilitiesResolvers
    ];

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });
  
    server.listen({ port: 5678 }).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
}
run().catch(console.dir);