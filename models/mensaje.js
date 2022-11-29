const { Schema, model } = require('mongoose');

const MensajeSchema = Schema(
  {
    de: {
      type: String,
      required: true,
    },
    para: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Mensaje', MensajeSchema);
