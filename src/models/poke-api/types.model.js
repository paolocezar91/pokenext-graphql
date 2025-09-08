const mongoose = require("mongoose");
const { namedApiResourceSchema } = require("./utils.js");

const typesSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    pokemon: [{ slot: Number, pokemon: namedApiResourceSchema }],
    moves: [namedApiResourceSchema],
  },
  { collection: "type" },
);

module.exports = mongoose.model("Types", typesSchema);
