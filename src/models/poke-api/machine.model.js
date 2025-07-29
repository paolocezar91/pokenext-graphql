const mongoose = require('mongoose');
const { namedApiResourceSchema } = require('./utils.js');

const machinesSchema
 = new mongoose.Schema({
  id: Number,
  item: namedApiResourceSchema,
  move: namedApiResourceSchema,
  version_group: namedApiResourceSchema
}, { collection: 'machine' });

module.exports = mongoose.model('Machines', machinesSchema);
