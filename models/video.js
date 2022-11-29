const { Schema, model } = require('mongoose');

const VideoSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Video', VideoSchema);
