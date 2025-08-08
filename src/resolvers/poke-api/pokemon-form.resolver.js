const { gql } = require('apollo-server');
const PokemonForm = require('../../models/poke-api/pokemon-form.model');

const pokemonFormResolvers = {
  Query: {
    pokemonFormByIds: async (_, { ids }) => {
      const query = { id: { $in: ids.map(Number) } };
      return await PokemonForm.find(query).sort({id: 1}).lean();
    }
  },
};

const pokemonFormTypeDefs = gql`
  type PokemonForm {
    id: Int
    name: String
    is_mega: Boolean
    is_default: Boolean
  }

  type Query {
    pokemonFormByIds(ids: [ID]): [PokemonForm]
  }
`;

module.exports = { pokemonFormTypeDefs, pokemonFormResolvers };