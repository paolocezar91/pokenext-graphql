const mongoose = require("mongoose");
const { namedApiResourceSchema } = require("./utils.js");

const itemSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    cost: Number,
    fling_power: Number,
    fling_effect: namedApiResourceSchema,
    attributes: [namedApiResourceSchema],
    category: {
      name: String,
    },
    effect_entries: [
      {
        effect: String,
        short_effect: String,
        language: { name: String },
      },
    ],
    flavor_text_entries: [
      {
        flavor_text: String,
        language: { name: String },
        version_group: namedApiResourceSchema,
      },
    ],
    game_indices: [
      {
        game_index: Number,
        generation: namedApiResourceSchema,
      },
    ],
    names: [
      {
        name: String,
        language: { name: String },
      },
    ],
    sprites: {
      default: String,
    },
    held_by_pokemon: [
      {
        pokemon: namedApiResourceSchema,
        version_details: [
          {
            rarity: String,
            version: namedApiResourceSchema,
          },
        ],
      },
    ],
    baby_trigger_for: {
      type: mongoose.Schema.Types.Mixed,
    },
    machines: [
      {
        machine: { url: String },
        version_group: namedApiResourceSchema,
      },
    ],
  },
  { collection: "item" }
);

module.exports = mongoose.model("Item", itemSchema);
