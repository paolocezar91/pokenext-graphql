const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  artwork_url: String,
  description_lang: String,
  list_table: Boolean,
  show_column: String,
  show_show_column: Boolean,
  show_thumb_table: Boolean,
  thumb_label_list: String,
  thumb_size_list: String,
  type_artwork_url: String,
  filter: {
    name: String,
    types: String
  },
  sorting: [{
    key: String,
    dir: String
  }]
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);