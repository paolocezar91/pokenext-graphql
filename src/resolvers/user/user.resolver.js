const { gql } = require("apollo-server-express");
const User = require("../../models/user/user.model");
const { getCache, setCache } = require("../../redis");

const userResolvers = {
  Query: {
    users: async () => {
      return await User.find({});
    },
    user: async (_, { email }) => {
      return getCache(`user:${email}`, async () => {
        const user = await User.findOne({ email });
        setCache(`user:${email}`, user);
        return user;
      });
    },
  },
  Mutation: {
    createUser: async (_, { email }) => {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ email });
      }
      return user;
    },
    deleteUser: async (_, { id }) => {
      await User.findByIdAndDelete(id);
      return true;
    },
  },
  User: {
    id: (parent) => {
      return parent._id.toString();
    },
  },
};

const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Query {
    users: [User]
    user(email: String!): User
  }

  type Mutation {
    createUser(email: String!): User
    deleteUser(id: ID!): Boolean
  }
`;

module.exports = { userTypeDefs, userResolvers };
