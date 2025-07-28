const mongoose = require('mongoose');
const { namedApiResourceSchema } = require('./utils.js');

const movesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  power: Number,
  accuracy: Number,
  pp: Number,
  learned_by_pokemon: [namedApiResourceSchema],
  target: namedApiResourceSchema,
  flavor_text_entries: [{
      flavor_text: String,
      language: { name: String },
      version_group: { name: String }
  }],
  type: namedApiResourceSchema,
  damage_class: {
    name: String
  },
  effect_entries: [{
    language: { name: String },
    effect: String
  }],
  machines: [
    {
      machine: {
        url: String
      },
      version_group: namedApiResourceSchema
    }
  ]
}, { collection: 'move' });

module.exports = mongoose.model('Moves', movesSchema);
