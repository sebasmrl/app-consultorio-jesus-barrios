const { Schema, model } = require('mongoose');

const PreguntaSchema = Schema(
  {
    usuario: {
      type: String,
      required: true,
    },
    texto: {
      type: String,
      required: true,
    },
    respuesta: {
      type: String,
      required: false,
    },
    administrador: {
      type: String,
      required: false,
    },
    solved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model('Pregunta', PreguntaSchema);
