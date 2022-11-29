const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const { response, request } = require('express');

const deleteFile = require('../helpers/deleteFile.js');

const { Mensaje, Usuario } = require('../models');
const { Types } = require('mongoose');

const mensajesGet = async (req = request, res = response) => {
  const { de = /.*/, para = /.*/ } = req.query;
  const query = {
    $or: [
      { de, para },
      { de: para, para: de },
    ],
  };

  const [total, mensajes] = await Promise.all([
    Mensaje.countDocuments(query),
    Mensaje.find(query).sort({ createdAt: 'desc' }),
  ]);

  res.json({
    total,
    mensajes,
  });
};

const mensajesPost = async (req, res = response) => {
  const { de, para, msg, fecha } = req.body;
  const mensaje = new Mensaje({ de, para, msg, fecha });

  // Guardar en BD
  mensaje.save((err, mensaje) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({
      mensaje,
    });
  });
};

const historial = async (req, res = response) => {
  const { de = /.*/, para = /.*/ } = req.query;
  const query = {
    $or: [
      { de, para },
      { de: para, para: de },
    ],
  };

  const mensajes = await Mensaje.find(query).sort({ createdAt: 'desc' });
  const users = await Usuario.find({
    $or: [{ _id: Types.ObjectId(de) }, { _id: Types.ObjectId(para) }],
  }).select('nombre');

  const arr = mensajes.map(({ de, para, msg: Mensaje, createdAt }) => ({
    Remitente: users.find(u => u.id == de).nombre,
    Destinatario: users.find(u => u.id == para).nombre,
    Mensaje,
    Fecha: new Date(createdAt).toLocaleString(),
  }));

  const filePath =
    __dirname + '/tempHistory' + new Date().getMilliseconds() + '.xlsx';

  const sheet = XLSX.utils.json_to_sheet(arr.reverse());
  sheet['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 50 }, { wch: 20 }];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'sheet1');

  XLSX.writeFile(book, filePath);

  res.sendFile(filePath);

  deleteFile(filePath);
};

module.exports = {
  mensajesGet,
  mensajesPost,
  historial,
};
