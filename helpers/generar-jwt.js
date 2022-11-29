const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/index');

const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        //console.log("------------------- ",token)
        if (!err) return resolve(token);

        //console.log(err);
        reject('No se pudo generar el token');
      }
    );
  });
};

const verificarJWT = async (token = '') => {
  try {
    if (token.length < 10) return null;

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);

    if (!usuario) return null;

    return usuario;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generarJWT,
  verificarJWT,
};
