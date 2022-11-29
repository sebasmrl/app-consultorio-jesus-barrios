const { response, request } = require('express');

const { Pregunta } = require('../models');

const preguntasGet = async (req = request, res = response) => {
  const { busqueda = /.*/ } = req.query;
  const { rol } = req.usuario;

  const regex = new RegExp(busqueda, 'i');

  const solv = rol === 'ADMIN_ROLE' ? {} : { solved: true };

  const query = {
    texto: regex,
    ...solv,
  };

  const [total, preguntas] = await Promise.all([
    Pregunta.countDocuments(query),
    Pregunta.find(query).sort({ solved: 'asc', createdAt: 'asc' }),
  ]);

  res.json({
    total,
    preguntas,
  });
};

const preguntasPost = async (req, res = response) => {
  const { usuario, texto } = req.body;
  const pregunta = new Pregunta({ usuario, texto });

  pregunta.save((err, pregunta) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({
      pregunta,
    });
  });
};

const preguntasPut = async (req, res = response) => {
  const { id = '' } = req.params;
  const { administrador, respuesta, solved } = req.body;

  Pregunta.findByIdAndUpdate(
    id,
    { administrador, respuesta, solved },
    {},
    (err, pregunta) => {
      if (err)
        return res.status(400).json({ msg: err.message, errors: err.errors });

      res.json({
        pregunta,
      });
    }
  );
};

const preguntasDelete = async (req, res = response) => {
  const { id } = req.params;

  await Pregunta.findByIdAndDelete(id, (err, pregunta) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({ pregunta });
  });
};

module.exports = {
  preguntasGet,
  preguntasPost,
  preguntasDelete,
  preguntasPut,
};
