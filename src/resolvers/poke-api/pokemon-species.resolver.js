const { gql } = require("apollo-server-express");
const PokemonSpecies = require("../../models/poke-api/pokemon-species.model");

const pokemonSpeciesResolvers = {
  Query: {
    pokemonSpecies: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      return await PokemonSpecies.findOne(query).lean();
    },
  },
};

const pokemonSpeciesTypeDefs = gql`
  type NamedApiResource {
    name: String
    url: String
  }

  type EvolutionChain {
    url: String
  }

  type FlavorTextEntry {
    flavor_text: String
    language: NamedApiResource
    version: NamedApiResource
  }

  type Genus {
    genus: String
    language: NamedApiResource
  }

  type NameEntry {
    language: NamedApiResource
    name: String
  }

  type Variety {
    is_default: Boolean
    pokemon: NamedApiResource
  }

  type FormDescription {
    description: String
    language: NamedApiResource
  }

  type PokemonSpecies {
    base_happiness: Int
    capture_rate: Int
    color: NamedApiResource
    egg_groups: [NamedApiResource]
    evolution_chain: EvolutionChain
    evolves_from_species: NamedApiResource
    flavor_text_entries: [FlavorTextEntry]
    form_descriptions: [FormDescription]
    forms_switchable: Boolean
    gender_rate: Int
    genera: [Genus]
    generation: NamedApiResource
    growth_rate: NamedApiResource
    habitat: NamedApiResource
    has_gender_differences: Boolean
    hatch_counter: Int
    id: Int
    is_baby: Boolean
    is_legendary: Boolean
    is_mythical: Boolean
    name: String
    names: [NameEntry]
    shape: NamedApiResource
    varieties: [Variety]
  }

  type Query {
    pokemonSpecies(id: Int, name: String): PokemonSpecies
  }
`;

module.exports = { pokemonSpeciesTypeDefs, pokemonSpeciesResolvers };
