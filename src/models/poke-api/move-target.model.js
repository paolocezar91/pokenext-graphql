const mongoose = require('mongoose');
const { namedApiResourceSchema } = require('./utils.js');

const moveTargetSchema
 = new mongoose.Schema({
  id: Number,
  name: String,
  descriptions: [{
    description: String,
    language: namedApiResourceSchema
  }],
  moves: [namedApiResourceSchema]
}, { collection: 'move-target' });

module.exports = mongoose.model('MoveTarget', moveTargetSchema);
