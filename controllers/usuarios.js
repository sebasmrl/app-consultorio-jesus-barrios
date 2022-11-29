const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const deleteFile = require('../helpers/deleteFile');

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(),
    Usuario.find().skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const usuario = new Usuario(req.body);

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(req.body.password, salt);

  try {
    // Guardar en BD
    const usuarioGuardado = await usuario.save();

    if (usuarioGuardado !== undefined) {
      //------------------hacer el envio de correo-------------------------
    /*   const mailData = {
        correo: usuario.correo,
        asunto: "Registro Exitoso en Consultorio Virtual de Trabajo Social",
        mensaje: "Hola Consultorio Virtual de Trabajo Social"
      } */

    /*   const emailSettingsCURN = {
        "url": "ENDPOINT_NOTIFY/notificabasica",
        "method": "POST",
        "data": mailData
      }; */
      //const msjMail = await axios(emailSettingsCURN);

      res.json({
        usuario
      });
    }

  } catch (error) {
    res.status(400).json({ msg: err.message, errors: err.errors });
  }

};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  await Usuario.findByIdAndUpdate(id, resto, {}, (err, usuario) => {
    if (err) return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json(usuario);
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  await Usuario.findByIdAndDelete(id, {}, (err, usuario) => {
    if (err) return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({ usuario });
  });
};

const tabla = async (_, res = response) => {
  const usuarios = await Usuario.find().sort({
    createdAt: 'desc',
  });

  const arr = usuarios.map(
    ({
      correo,
      nombre,
      rol,
      createdAt,
      tel,
      genero,
      estado,
      seguridad,
      nacimiento,
      ciudad,
      carrera,
      semestre,
      ocupacion,
      estudios,
      motivo,
      text,
    }) => ({
      Nombre: nombre,
      Correo: correo,
      Rol: rol
        .replace('_ROLE', '')
        .replace('PATIENT', 'Paciente')
        .replace('ADMIN', 'Administrador')
        .replace('USER', 'Trabajador Social'),
      Telefono: tel,
      Genero: genero,
      'Estado Civil': estado,
      'Seguridad Social': seguridad,
      'Fecha de Nacimiento': nacimiento,
      'Ciudad de Nacimiento': ciudad,
      Carrera: carrera,
      Semestre: semestre,
      Ocupación: ocupacion,
      Estudios: estudios,
      Motivo: motivo,
      Enteramiento: text,
      'Fecha de Creación': new Date(createdAt).toLocaleString(),
    })
  );

  const filePath = __dirname + '/tempHistory' + new Date().getMilliseconds() + '.xlsx';

  const sheet = XLSX.utils.json_to_sheet(arr);
  sheet['!cols'] = [
    { wch: 30 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 20 },
    { wch: 30 },
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
    { wch: 10 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
  ];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'sheet1');

  XLSX.writeFile(book, filePath);

  res.sendFile(filePath);

  deleteFile(filePath);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  tabla,
};
