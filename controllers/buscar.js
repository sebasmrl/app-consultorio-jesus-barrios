const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Mensaje } = require('../models');

const buscarUsuarios = async (req, res = response) => {
  const { termino } = req.params;

  const esMongoID = ObjectId.isValid(termino); // TRUE

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, 'i');
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }, { rol: regex }],
  }).sort({ rol: 1 });

  res.json({
    results: usuarios,
  });
};

const buscarChatsConAdmin = async (req, res = response) => {
  let { buscarChatsConAdmin, uid } = req.query;

  if (buscarChatsConAdmin && uid) buscarChatsConAdmin = JSON.parse(buscarChatsConAdmin);

  const admins = await Usuario.find({ rol: 'ADMIN_ROLE' });

  const ids = admins.map(us => us.id);

  const chats = ids.map(aid =>
    Mensaje.find({
      $or: [
        { de: uid, para: aid },
        { de: aid, para: uid },
      ],
    }).exec()
  );

  const idsWithChat = (await Promise.all(chats)).map(([{ de, para } = 0]) => {
    let id = de;

    if (ids.includes(para)) id = para;

    return id;
  });

  const adminsWithChat = admins.filter(us => idsWithChat.includes(us.id));

  res.json({
    admins: adminsWithChat,
  });
};

module.exports = {
  buscarUsuarios,
  buscarChatsConAdmin,
};
