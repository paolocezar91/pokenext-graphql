const { gql } = require('apollo-server-express');
const MoveTarget = require('../../models/poke-api/move-target.model');

const moveTargetResolvers = {
  Query: {
    moveTargetById: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      const moveTarget = await MoveTarget.findOne(query).lean();
      return moveTarget
    },
  },
};

const moveTargetTypeDefs = gql`
  type NamedApiResource {
    name: String
    url: String
  }

  type LanguageDescription {
    name: String
    url: String
  }

  type Description {
    description: String
    language: LanguageDescription
  }

  type MoveTarget {
    id: Int
    name: String
    descriptions: [Description]
    moves: NamedApiResource
  }

  type Query {
    moveTargetById(id: ID!): MoveTarget
  }
`;

module.exports = { moveTargetTypeDefs, moveTargetResolvers };