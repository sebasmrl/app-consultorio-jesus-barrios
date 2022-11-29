const { Schema, model } = require('mongoose');

let facultades = {
  values: ['ing', 'soc', 'sal', 'adm'], //Ingenieria, Ciencias Sociales, Ciencias de la Salud, Ciencias Administrativas
  message: '{VALUE} no es una facultad valida.',
};

const LibroSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
      required: true,
    },
    facultad: {
      type: String,
      required: true,
      enum: facultades,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Libro', LibroSchema);
