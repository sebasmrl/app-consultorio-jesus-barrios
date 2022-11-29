const { Schema, model } = require('mongoose');

const roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE', 'PATIENT_ROLE'],
  message: '{VALUE} no es un rol valido.',
};

const gens = {
  values: ['M', 'F', 'O'],
  message: '{VALUE} no es un genero valido.',
};

const estados = {
  values: ['Solter@', 'Casad@', 'Union Libre', 'Viud@', ''],
  message: '{VALUE} no es un estado valido.',
};

const estudios = {
  values: [
    'Sin Estudio',
    'Primaria Inconclusa',
    'Primaria Completada',
    'Secundaria Inconclusa',
    'Secundaria Completada',
    'Estudiante Universitario',
    'Profesional',
    'Posgrado',
    '',
  ],
  message: '{VALUE} no es un estudio valido.',
};

const seguridades = {
  values: ['Contributiva', 'Subsidiada', ''],
  message: '{VALUE} no es una seguridad social valida.',
};

const UsuarioSchema = Schema(
  {
    nombre: {
      type: String,
      required: [false, 'El nombre es obligatorio'],
    },

    correo: {
      type: String,
      required: [false, 'El correo es obligatorio'],
      unique: false,
    },
    password: {
      type: String,
      required: [false, 'La contraseña es obligatoria'],
    },
    google: {
      type: Boolean,
      default: false,
    },
    rol: {
      type: String,
      required: false,
      default: 'PATIENT_ROLE',
      enum: roles,
    },
    tel: {
      type: String,
      required: false,
    },
    nacimiento: {
      type: String,
      required: false,
      default: '',
    },
    genero: {
      type: String,
      default: 'O',
      enum: gens,
    },
    estadoCivil: {
      type: String,
      required: false,
      enum: estados,
      default: '',
    },
    ciudad: {
      type: String,
      required: false,
      default: '',
    },
    seguridad: {
      type: String,
      required: false,
      enum: seguridades,
      default: '',
    },
    ocupacion: {
      type: String,
      required: false,
      default: '',
    },
    estudios: {
      type: String,
      required: false,
      enum: estudios,
      default: '',
    },
    carrera: {
      type: String,
      required: false,
      default: '',
    },
    semestre: {
      type: String,
      required: false,
      default: '',
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
    motivo: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true }
);

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
