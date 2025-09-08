const { userTypeDefs, userResolvers } = require("./user/user.resolver");
const {
  userSettingsTypeDefs,
  userSettingsResolvers,
} = require("./user/user-settings.resolver");
const {
  pokemonTypeDefs,
  pokemonResolvers,
} = require("./poke-api/pokemon.resolver");
const {
  pokemonSpeciesTypeDefs,
  pokemonSpeciesResolvers,
} = require("./poke-api/pokemon-species.resolver");
const { typesTypeDefs, typesResolvers } = require("./poke-api/types.resolver");
const { movesTypeDefs, movesResolvers } = require("./poke-api/moves.resolver");
const {
  evolutionChainResolvers,
  evolutionChainTypeDefs,
} = require("./poke-api/evolution-chain.resolver");
const {
  abilitiesResolvers,
  abilitiesTypeDefs,
} = require("./poke-api/ability.resolver");
const {
  machinesTypeDefs,
  machinesResolvers,
} = require("./poke-api/machines.resolver");
const {
  moveTargetTypeDefs,
  moveTargetResolvers,
} = require("./poke-api/move-target.resolver");
const {
  pokemonFormTypeDefs,
  pokemonFormResolvers,
} = require("./poke-api/pokemon-form.resolver");

const typeDefs = [
  userTypeDefs,
  userSettingsTypeDefs,
  pokemonTypeDefs,
  pokemonSpeciesTypeDefs,
  typesTypeDefs,
  movesTypeDefs,
  evolutionChainTypeDefs,
  abilitiesTypeDefs,
  machinesTypeDefs,
  moveTargetTypeDefs,
  pokemonFormTypeDefs,
];

const resolvers = [
  userResolvers,
  userSettingsResolvers,
  pokemonResolvers,
  pokemonSpeciesResolvers,
  typesResolvers,
  movesResolvers,
  evolutionChainResolvers,
  abilitiesResolvers,
  machinesResolvers,
  moveTargetResolvers,
  pokemonFormResolvers,
];

module.exports = { resolvers, typeDefs };
