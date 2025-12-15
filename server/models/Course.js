const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
