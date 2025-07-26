const mongoose = require('mongoose');
const { namedApiResourceSchema } = require('./utils.js');

const evolutionDetailSchema = new mongoose.Schema({
  item: namedApiResourceSchema,
  trigger: namedApiResourceSchema,
  gender: Number,
  held_item: namedApiResourceSchema,
  move: namedApiResourceSchema,
  known_move_type: namedApiResourceSchema,
  location: namedApiResourceSchema,
  min_level: Number,
  min_happiness: Number,
  min_beauty: Number,
  min_affection: Number,
  needs_overworld_rain: Boolean,
  party_species: namedApiResourceSchema,
  party_type: namedApiResourceSchema,
  relative_physical_stats: Number,
  time_of_day: String,
  trade_species: namedApiResourceSchema,
  turn_upside_down: Boolean
}, { _id: false });

const chainLinkSchema = new mongoose.Schema({
  is_baby: Boolean,
  species: namedApiResourceSchema,
  evolution_details: [evolutionDetailSchema],
  evolves_to: [this] // Will be replaced after definition
}, { _id: false });

chainLinkSchema.add({ evolves_to: [chainLinkSchema] });

const evolutionChainSchema = new mongoose.Schema({
  id: Number,
  baby_trigger_item: namedApiResourceSchema,
  chain: chainLinkSchema
}, { collection: 'evolution-chain' });

module.exports = mongoose.model('EvolutionChain', evolutionChainSchema);