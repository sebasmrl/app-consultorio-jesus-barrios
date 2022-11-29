const { Socket } = require('socket.io');

const { verificarJWT } = require('../helpers/index');
const { Mensaje } = require('../models');
const ChatInfo = require('../models/chat-info');

const chatInfo = new ChatInfo();

const socketController = async (socket = new Socket(), io) => {
  const usuario = await verificarJWT(socket.handshake.headers['x-token']);
  
  
  //No se encuentra el usuario
  if (!usuario) return socket.disconnect();


  //Conectado
  chatInfo.conectarUsuario(usuario);
  io.emit('usuarios-activos', chatInfo.usuariosArr);

  //Desconectado
  socket.on('disconnect', () => {
    chatInfo.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chatInfo.usuariosArr);
  });

  //Sala del Usuario
  socket.join(usuario.id);

  //Mensaje
  socket.on('enviar-mensaje', async ({ uid, msg }) => {
    if (!uid) return;

    

    //Mensaje privado
    chatInfo.enviarMensaje(usuario.id, usuario.nombre, msg);
    socket.to(uid).emit('mensaje-privado', {
      de: usuario.id,
      msg,
    });

    const mensaje = new Mensaje({ de: usuario.id, para: uid, msg });

    // Guardar en BD
    await mensaje.save();
  });
};

module.exports = { socketController };
