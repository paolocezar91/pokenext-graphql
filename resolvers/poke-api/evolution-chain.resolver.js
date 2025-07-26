const { gql } = require('apollo-server');
const EvolutionChain = require('../../models/poke-api/evolution-chain.model');

const evolutionChainResolvers = {
  Query: {
    evolutionChain: async (_, { id  }) => {
      return await EvolutionChain.findOne({id}).lean();
    },
  },
};

const evolutionChainTypeDefs = gql`
  type NamedApiResource {
    name: String
    url: String
  }

  type EvolutionDetail {
    item: NamedApiResource
    trigger: NamedApiResource
    gender: Int
    held_item: NamedApiResource
    move: NamedApiResource
    known_move_type: NamedApiResource
    location: NamedApiResource
    min_level: Int
    min_happiness: Int
    min_beauty: Int
    min_affection: Int
    needs_overworld_rain: Boolean
    party_species: NamedApiResource
    party_type: NamedApiResource
    relative_physical_stats: Int
    time_of_day: String
    trade_species: NamedApiResource
    turn_upside_down: Boolean
  }

  type ChainLink {
    is_baby: Boolean
    species: NamedApiResource
    evolution_details: [EvolutionDetail]
    evolves_to: [ChainLink]
  }

  type EvolutionChain {
    id: Int
    baby_trigger_item: NamedApiResource
    chain: ChainLink
  }

  type Query {
    evolutionChain(id: Int): EvolutionChain
  }
`;

module.exports = { evolutionChainTypeDefs, evolutionChainResolvers };