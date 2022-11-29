const { response, request } = require('express');

const { Libro } = require('../models');

const librosGet = async (req = request, res = response) => {
  const { busqueda = /.*/, facultad = /.*/ } = req.query;

  const regex = new RegExp(busqueda, 'i');

  const query = {
    facultad,
    $or: [{ nombre: regex }, { autor: regex }],
  };

  const [total, libros] = await Promise.all([
    Libro.countDocuments(query),
    Libro.find(query).sort({ nombre: 'asc' }),
  ]);

  res.json({
    total,
    libros,
  });
};

const librosPost = async (req, res = response) => {
  const { nombre, autor, link, facultad } = req.body;
  const libro = new Libro({ nombre, autor, link, facultad });

  libro.save((err, libro) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({
      libro,
    });
  });
};

const librosDelete = async (req, res = response) => {
  const { id } = req.params;

  await Libro.findByIdAndDelete(id, (err, libro) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({ libro });
  });
};

module.exports = {
  librosGet,
  librosPost,
  librosDelete,
};
