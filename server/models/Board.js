const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  writer: { type: String, required: true },
  file: {
    filename: String,
    originalname: String,
    path: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Board = mongoose.model('Board', boardSchema);

module.exports = { Board };
