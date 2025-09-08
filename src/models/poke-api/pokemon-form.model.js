const mongoose = require("mongoose");

const pokemonFormSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    is_mega: Boolean,
    is_default: Boolean,
  },
  { collection: "pokemon-form" },
);

module.exports = mongoose.model("PokemonForm", pokemonFormSchema);
