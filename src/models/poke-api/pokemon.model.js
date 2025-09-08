const mongoose = require("mongoose");
const { namedApiResourceSchema } = require("./utils.js");

const pokemonSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    base_experience: Number,
    height: Number,
    weight: Number,
    is_default: Boolean,
    order: Number,
    location_area_encounters: String,
    abilities: [
      {
        ability: namedApiResourceSchema,
        is_hidden: Boolean,
        slot: Number,
      },
    ],
    cries: {
      latest: String,
      legacy: String,
    },
    forms: [namedApiResourceSchema],
    game_indices: [
      {
        game_index: Number,
        version: namedApiResourceSchema,
      },
    ],
    moves: [
      {
        move: namedApiResourceSchema,
        version_group_details: [
          {
            level_learned_at: Number,
            move_learn_method: namedApiResourceSchema,
            order: Number,
            version_group: namedApiResourceSchema,
          },
        ],
      },
    ],
    past_abilities: [
      {
        abilities: [
          {
            ability: mongoose.Schema.Types.Mixed,
            is_hidden: Boolean,
            slot: Number,
          },
        ],
        generation: namedApiResourceSchema,
      },
    ],
    past_types: [mongoose.Schema.Types.Mixed],
    species: namedApiResourceSchema,
    sprites: mongoose.Schema.Types.Mixed,
    stats: [
      {
        base_stat: Number,
        effort: Number,
        stat: namedApiResourceSchema,
      },
    ],
    types: [
      {
        slot: Number,
        type: namedApiResourceSchema,
      },
    ],
  },
  { collection: "pokemon" },
);

module.exports = mongoose.model("Pokemon", pokemonSchema);
