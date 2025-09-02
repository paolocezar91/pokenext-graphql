const { gql } = require('apollo-server-express');
const Abilities = require('../../models/poke-api/abilty.model');

const abilitiesResolvers = {
  Query: {
    abilityById: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      return await Abilities.findOne(query).lean();
    },
  },
};

const abilitiesTypeDefs = gql`
  type Language {
    name: String
  }

  type EffectEntries {
    effect: String
    short_effect: String
    language: Language
  }

  type Ability {
    id: Int
    name: String
    effect_entries: [EffectEntries]
  }

  type Query {
    abilityById(id: Int, name: String): Ability
  }
`;

module.exports = { abilitiesTypeDefs, abilitiesResolvers };