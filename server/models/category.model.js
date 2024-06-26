const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, default: null }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
