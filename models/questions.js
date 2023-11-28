const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctOption: {
    type: String,
    required: true,
  },
});

const MCQ = mongoose.model('MCQ', mcqSchema);

module.exports = MCQ;