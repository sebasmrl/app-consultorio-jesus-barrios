const { response, request } = require('express');

const { Video } = require('../models');

const videosGet = async (req = request, res = response) => {
  const { busqueda = /.*/ } = req.query;

  const regex = new RegExp(busqueda, 'i');

  const query = {
    $or: [{ nombre: regex }, { tipo: regex }],
  };

  const [total, videos] = await Promise.all([
    Video.countDocuments(query),
    Video.find(query).sort({ nombre: 'asc' }),
  ]);

  res.json({
    total,
    videos,
  });
};

const videosPost = async (req, res = response) => {
  const { nombre, link, tipo } = req.body;
  const video = new Video({ nombre, link, tipo });

  video.save((err, video) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({
      video,
    });
  });
};

const videosDelete = async (req, res = response) => {
  const { id } = req.params;

  await Video.findByIdAndDelete(id, (err, video) => {
    if (err)
      return res.status(400).json({ msg: err.message, errors: err.errors });

    res.json({ video });
  });
};

module.exports = {
  videosGet,
  videosPost,
  videosDelete,
};
