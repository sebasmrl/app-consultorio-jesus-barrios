const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('token') || req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }

  try {
    jwt.verify(token, process.env.SECRETORPRIVATEKEY, async (err, data) => {
      
      //console.log(err) -- error de impresion de Null indefinido
      if (err)
        return res.status(401).json({
          msg: 'Token no válido'+err,
        }); 

      // leer el usuario que corresponde al uid
      const usuario = await Usuario.findById(data.uid);

      // Verificar si el usuario existe en la base de datos
      if (!usuario)
        return res.status(401).json({
          msg: 'Token no válido - usuario no existe DB',
        });

      req.usuario = usuario;
      next();
    });
  } catch (error) {
    res.status(401).json({
      msg: 'Token no válido '+error
    });
  }
};

module.exports = {
  validarJWT,
};
