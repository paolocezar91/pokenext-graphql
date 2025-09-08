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
  type Color {
    name: String
    url: String
  }

  type EggGroup {
    name: String
    url: String
  }

  type EvolutionChain {
    url: String
  }

  type EvolvesFromSpecies {
    name: String
    url: String
  }

  type FlavorTextLanguage {
    name: String
    url: String
  }

  type FlavorTextVersion {
    name: String
    url: String
  }

  type FlavorTextEntry {
    flavor_text: String
    language: FlavorTextLanguage
    version: FlavorTextVersion
  }

  type GenusLanguage {
    name: String
    url: String
  }

  type Genus {
    genus: String
    language: GenusLanguage
  }

  type Generation {
    name: String
    url: String
  }

  type GrowthRate {
    name: String
    url: String
  }

  type Habitat {
    name: String
    url: String
  }

  type NameLanguage {
    name: String
    url: String
  }

  type NameEntry {
    language: NameLanguage
    name: String
  }

  type Shape {
    name: String
    url: String
  }

  type VarietyPokemon {
    name: String
    url: String
  }

  type Variety {
    is_default: Boolean
    pokemon: VarietyPokemon
  }

  type FormDescription {
    description: String
    language: NameLanguage
  }

  type PokemonSpecies {
    base_happiness: Int
    capture_rate: Int
    color: Color
    egg_groups: [EggGroup]
    evolution_chain: EvolutionChain
    evolves_from_species: EvolvesFromSpecies
    flavor_text_entries: [FlavorTextEntry]
    form_descriptions: [FormDescription]
    forms_switchable: Boolean
    gender_rate: Int
    genera: [Genus]
    generation: Generation
    growth_rate: GrowthRate
    habitat: Habitat
    has_gender_differences: Boolean
    hatch_counter: Int
    id: Int
    is_baby: Boolean
    is_legendary: Boolean
    is_mythical: Boolean
    name: String
    names: [NameEntry]
    shape: Shape
    varieties: [Variety]
  }

  type Query {
    pokemonSpecies(id: Int, name: String): PokemonSpecies
  }
`;

module.exports = { pokemonSpeciesTypeDefs, pokemonSpeciesResolvers };
