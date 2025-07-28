const mongoose = require('mongoose');
const { namedApiResourceSchema } = require('./utils.js');

const pokemonSpeciesSchema = new mongoose.Schema({
  base_happiness: Number,
  capture_rate: Number,
  color: namedApiResourceSchema,
  egg_groups: [namedApiResourceSchema],
  evolution_chain: {
    url: String
  },
  evolves_from_species: namedApiResourceSchema,
  flavor_text_entries: [
    {
      flavor_text: String,
      language: namedApiResourceSchema,
      version: namedApiResourceSchema
    }
  ],
  form_descriptions: [mongoose.Schema.Types.Mixed],
  forms_switchable: Boolean,
  gender_rate: Number,
  genera: [
    {
      genus: String,
      language: namedApiResourceSchema
    }
  ],
  generation: namedApiResourceSchema,
  growth_rate: namedApiResourceSchema,
  habitat: namedApiResourceSchema,
  has_gender_differences: Boolean,
  hatch_counter: Number,
  id: Number,
  is_baby: Boolean,
  is_legendary: Boolean,
  is_mythical: Boolean,
  name: String,
  names: [
    {
      language: namedApiResourceSchema,
      name: String
    }
  ],
  shape: namedApiResourceSchema,
  varieties: [
    {
      is_default: Boolean,
      pokemon: namedApiResourceSchema
    }
  ]
}, { collection: 'pokemon-species' });

module.exports = mongoose.model('PokemonSpecies', pokemonSpeciesSchema);