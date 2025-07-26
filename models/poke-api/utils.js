const mongoose = require('mongoose');

const namedApiResourceSchema = new mongoose.Schema({
  name: String,
  url: String
}, { _id: false });

module.exports = { namedApiResourceSchema };