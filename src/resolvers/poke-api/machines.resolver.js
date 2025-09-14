const { gql } = require("apollo-server-express");
const Machines = require("../../models/poke-api/machine.model");

const machinesResolvers = {
  Query: {
    machinesByIds: async (_, { ids }) => {
      const query = { id: { $in: ids.map(Number) } };
      return await Machines.find(query).lean();
    },
  },
};

const machinesTypeDefs = gql`
  type NamedApiResource {
    name: String
    url: String
  }

  type Machine {
    id: Int
    item: NamedApiResource
    move: NamedApiResource
    version_group: NamedApiResource
  }

  type Query {
    machinesByIds(ids: [ID]): [Machine]
  }
`;

module.exports = { machinesTypeDefs, machinesResolvers };
