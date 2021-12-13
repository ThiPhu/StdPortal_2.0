const mongoose = require('mongoose');

// Defining schema
let Schema = mongoose.Schema;

const SectionSchema = new Schema({
  name: String,
  unit: String
});


const Section = mongoose.model('Sections', SectionSchema);

module.exports = Section
