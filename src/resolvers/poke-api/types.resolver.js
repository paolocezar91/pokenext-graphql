const { gql } = require('apollo-server');
const Types = require('../../models/poke-api/types.model');

const typesResolvers = {
  Query: {
    types: async () => {
      const projection = { id: 1, name: 1 };
      const types = await Types.find({}, projection)
        .limit(18)
        .lean();

      return types;
    },
    pokemonType: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      const projection = { pokemon: 1, moves: 1, name: 1, id: 1 };
      return await Types.findOne(query, projection).lean();
    },
  },
};

const typesTypeDefs = gql`
  type Details {
    name: String
    url: String
  }

  type PokemonDetails {
    pokemon: Details
  }
  
  type PokemonType {
    id: Int
    name: String
    pokemon: [PokemonDetails]
    moves: [Details]
  }

  type PokemonTypeSimple {
    id: Int
    name: String
  }

  type Query {
    types: [PokemonTypeSimple]
    pokemonType(id: Int, name: String): PokemonType
  }
`;

module.exports = { typesResolvers, typesTypeDefs };