const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: String,
  content: String,
  writer: String,
}, {
  timestamps: true
});

const Board = mongoose.model('Board', boardSchema);
module.exports = { Board };
