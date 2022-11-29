const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario)
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo',
      });

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword)
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      });

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;
  const token = await generarJWT(usuario.id);

  res.json({ usuario, token });
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

try {
  const {email, name}= await googleVerify(id_token);
  let usuario = await Usuario.findOne({ correo: email})
  
if(!usuario){

  const data = {
    nombre: name,
    correo: email,
    password: ":P"
  }

  usuario = new Usuario(data);
  await usuario.save();

  //Generear correo de usuario Registrado 


  const token = await generarJWT(usuario.id);
  return res.json({ token});
  
}else{
  const token = await generarJWT(usuario.id);
  return res.json({ token});
}

 
} catch (error) {
  return res.status(401)
    .json({
        msg: 'Hable con el administador',
        error
      })
}

  
}


module.exports = {
  login,
  renovarToken,
  googleSignIn
};
