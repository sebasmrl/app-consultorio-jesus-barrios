class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid;
    this.nombre = nombre;
    this.mensaje = mensaje;
  }
}

class ChatInfo {
  constructor() {
    this.mensajes = [];
    this.usuarios = {};
  }

  get ultimos10() {
    return [...this.mensajes].splice(0, 10);
  }

  get usuariosArr() {
    return Object.values(this.usuarios);
  }

  enviarMensaje(uid, nombre, mensaje) {
    this.mensajes.unshift(new Mensaje(uid, nombre, mensaje));
  }

  conectarUsuario(usuario) {
    this.usuarios[usuario.id] = usuario;
  }

  desconectarUsuario(id) {
    delete this.usuarios[id];
  }
}

module.exports = ChatInfo;
