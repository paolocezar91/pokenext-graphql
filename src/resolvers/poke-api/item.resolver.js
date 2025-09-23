const { gql } = require("apollo-server-express");
const Item = require("../../models/poke-api/item.model");

const itemResolvers = {
  Query: {
    items: async (_, { limit = 50, offset = 0, name = "" }) => {
      const projection = {
        id: 1,
        name: 1,
        cost: 1,
        category: 1,
      };

      const query = {};
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      const items = await Item.find(query, projection)
        .skip(offset)
        .limit(limit)
        .lean();

      return items;
    },
    itemById: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      return await Item.findOne(query).lean();
    },
    itemsByIds: async (_, { ids }) => {
      const query = { id: { $in: ids[0].split(",").map(Number) } };
      return await Item.find(query).sort({ id: 1 }).lean();
    },
  },
};

const itemTypeDefs = gql`
  type NamedApiResource {
    name: String
    url: String
  }

  type ItemAttribute {
    name: String
  }

  type ItemCategory {
    name: String
  }

  type ItemFlingEffect {
    name: String
  }

  type EffectEntry {
    effect: String
    short_effect: String
    language: NamedApiResource
  }

  type GenerationGameIndex {
    game_index: Int
    generation: NamedApiResource
  }

  type Name {
    name: String
    language: NamedApiResource
  }

  type ItemSprites {
    default: String
  }

  type ItemHolderPokemonVersionDetail {
    rarity: String
    version: NamedApiResource
  }

  type ItemHolderPokemon {
    pokemon: NamedApiResource
    version_details: [ItemHolderPokemonVersionDetail]
  }

  type MachineItem {
    machine: NamedApiResource
    version_group: NamedApiResource
  }

  type FlavorTextEntryItem {
    text: String
    language: NamedApiResource
    version_group: NamedApiResource
  }

  type Item {
    id: Int
    name: String
    cost: Int
    fling_power: Int
    fling_effect: NamedApiResource
    attributes: [NamedApiResource]
    category: ItemCategory
    effect_entries: [EffectEntry]
    flavor_text_entries: [FlavorTextEntryItem]
    game_indices: [GenerationGameIndex]
    names: [Name]
    sprites: ItemSprites
    held_by_pokemon: [ItemHolderPokemon]
    baby_trigger_for: String
    machines: [MachineItem]
  }

  type Query {
    items(limit: Int, offset: Int, name: String): [Item]
    itemsByIds(ids: [ID]): [Item]
    itemById(id: Int, name: String): Item
  }
`;

module.exports = { itemTypeDefs, itemResolvers };
