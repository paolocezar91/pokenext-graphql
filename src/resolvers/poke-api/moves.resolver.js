const { gql } = require('apollo-server-express');
const Moves = require('../../models/poke-api/moves.model');

const movesResolvers = {
  Query: {
    moves: async () => {
      const moves = await Moves.find().lean();
      return moves;
    },
    moveById: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      return await Moves.findOne(query).lean();
    },
    movesByIds: async (_, { ids }) => {
      const query = { id: { $in: ids[0].split(",").map(Number) } };
      return await Moves.find(query).sort({id: 1}).lean();
    }
  },
};

const movesTypeDefs = gql`
  type NamedApiResource {
    name: String
    url: String
  }

  type Language {
    name: String
  }

  type VersionGroup {
    name: String
  }

  type FlavorTextEntries {
    flavor_text: String
    language: Language
    version_group: VersionGroup
  }

  type DamageClass {
    name: String
  }

  type EffectEntries {
    language: Language
    effect: String
  }

  type MachineDetails {
    url: String
  }

  type Machine {
    machine: MachineDetails
    version_group: NamedApiResource
  }

  type Move {
    id: Int
    name: String
    power: Int
    accuracy: Int
    pp: Int
    learned_by_pokemon: [NamedApiResource]
    target: NamedApiResource
    flavor_text_entries: [FlavorTextEntries]
    type: NamedApiResource
    damage_class: DamageClass
    effect_entries: [EffectEntries]
    machines: [Machine]
  }

  type Query {
    moves: [Move]
    movesByIds(ids: [ID]): [Move]
    moveById(id: Int, name: String): Move
  }
`;

module.exports = { movesTypeDefs, movesResolvers };