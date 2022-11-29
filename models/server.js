const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      usuarios: '/api/usuarios',
      mensajes: '/api/mensajes',
      libros: '/api/libros',
      videos: '/api/videos',
      preguntas: '/api/preguntas',
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    // Sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE',"HEAD", "PATCH"],
        allowedHeaders: '*',
      })
    );

    // Lectura y parseo del body
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    // Directorio Público
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.mensajes, require('../routes/mensajes'));
    this.app.use(this.paths.libros, require('../routes/libros'));
    this.app.use(this.paths.videos, require('../routes/videos'));
    this.app.use(this.paths.preguntas, require('../routes/preguntas'));
  }

  sockets() {
    this.io.on('connection', socket => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () =>
      console.log('Servidor corriendo en puerto', this.port)
    );
  }
}

module.exports = Server;
