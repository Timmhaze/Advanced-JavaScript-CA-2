// Schema for Pieces and Categories
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  category: String
});

const PieceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: [CategorySchema],
    required: true
  }
});

const Piece = mongoose.model('Piece', PieceSchema);

module.exports = Piece;
