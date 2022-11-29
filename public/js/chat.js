let socket;
let activos = [];
let selectedUser;
let chat;
let usuario;

const main = async () => {
  //Validar Token
  usuario = await checkLogged();
  if (!usuario) return;

  //Referencias HTML
  chat = document.getElementById('messages');

  document.getElementById('chatForm').onsubmit = e => {
    e.preventDefault();

    enviarMensaje();
  };

  //Conectar Socket
  await conectarSocket();

  cargarUsuarios();
};

const conectarSocket = async () => {

  socket = io(
    `${location.protocol}//${location.host}`,
    {
      //path: '/consultorio',
      path: '',
      extraHeaders: {
       'x-token': token,
      },
    }
  );

  //Eventos
  socket.on('connect', conectado);
  socket.on('disconnect', desconectado);
  socket.on('mensaje-privado', recibirMensaje);
  socket.on('usuarios-activos', usuariosActivos);
};

const cargarUsuarios = async () => {
  const usuarios = document.getElementById('usuarios');

  try {
    let response = await Promise.all([
      fetch(
        `${url}buscar/${
          {
            ADMIN_ROLE: '@',
            USER_ROLE: 'PATIENT',
            PATIENT_ROLE: 'USER_ROLE',
          }[usuario.rol]
        }`,
        {
          headers: { 'Content-Type': 'application/json', 'x-token': token },
        }
      ).catch(err => ({
        msg: err,
      })),

      fetch(`${url}buscar/extra/buscarChatsConAdmin?buscarChatsConAdmin=true&uid=${usuario.uid}`, {
        headers: { 'Content-Type': 'application/json', 'x-token': token },
      }).catch(err => ({
        msg: err,
      })),
    ]);

    const [{ results = [] }, { admins = [] }] = await Promise.all(response.map(res => res.json()));

    const users = results.filter(us => !admins.includes(us)).filter(us => us.uid !== usuario.uid);

    while (usuarios.hasChildNodes()) {
      usuarios.removeChild(usuarios.lastChild);
    }

    console.log(usuarios.innerHTML);

    usuarios.innerHTML = `<h1 class="text-3xl font-light">${
      // {
      //   ADMIN_ROLE: 'Usuarios',
      //   USER_ROLE: 'Pacientes',
      //   PATIENT_ROLE: 'Trabajadores Sociales',
      // }[usuario.rol]
      'Salas'
    }</h1>`;

    users
      .sort(a => (a.nombre.includes('Asesoría') ? -1 : 1))
      .forEach((us, i, arr) => {
        if (us.uid === usuario.uid) return;

        const item = document.createElement('div');

        item.innerHTML = `
        <div class="flex items-center gap-2 p-3 w-full bg-gray-100 overflow-hidden rounded-md transform transition-all duration-150 hover:bg-gray-200" id="item-${
          us.uid
        }">
          <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            activos.includes(us.uid) ? 'bg-green-400' : 'bg-red-400'
          }"> </div>
          <div class="flex-grow overflow-hidden">
            <p class="text-xl truncate">${us.nombre}</p>
            ${us.rol === 'ADMIN_ROLE' ? '<p class="text-gray-400 text-sm">Administrador</p>' : ''}
          </div>
        </div>
        ${
          arr[i + 1]
            ? (us.nombre.includes('Asesoría') && !arr[i + 1].nombre.includes('Asesoría')) ||
              (us.rol === 'ADMIN_ROLE' && arr[i + 1].rol !== 'ADMIN_ROLE')
              ? `
        
          <div class="w-full h-px border border-gray-200 rounded-full mt-3 mb-2" />
        `
              : ''
            : ''
        }
      `.trim();

        usuarios.appendChild(item);

        const el = document.getElementById('item-' + us.uid);

        el.addEventListener('click', _ => {
          selectedUser = '' + us.uid;
          chat.innerHTML = '';
          cargarDesdeLaBD();
        });
      });
  } catch (error) {
    return console.log('Error');
  }
};

const enviarMensaje = async () => {
  const input = document.getElementById('msg');
  const msg = input?.value;

  if (msg?.length === 0) return;

  console.log(socket);
  socket.emit('enviar-mensaje', {
    msg,
    uid: selectedUser,
  });

  input.value = '';

  let html = `
  <div class="flex w-full justify-end">
    <div class="p-2 text-xl bg-blue-100 rounded-md w-max text-right">
      ${msg}
    </div>
  </div>`;

  const msgItem = document.createElement('div');
  msgItem.innerHTML = html.trim();

  chat.appendChild(msgItem);
};

const cargarMensaje = mensaje => {
  const { de, msg } = mensaje;

  if (de !== selectedUser) return;

  let html = `
      <div class="flex w-full justify-end">
        <div class="p-2 text-xl bg-blue-100 rounded-md w-max text-right">
          ${msg}
        </div>
      </div>`;

  if (de == selectedUser)
    html = `
        <div class="p-2 text-xl bg-white border w-max rounded-md">
          ${msg}
        </div>`;

  const msgItem = document.createElement('div');
  msgItem.innerHTML = html.trim();

  chat.appendChild(msgItem);
};

const cargarDesdeLaBD = async () => {
  const response = await (
    await fetch(url + `mensajes/?de=${usuario.uid}&para=${selectedUser}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.erros) return console.log('Error');

  response.mensajes.reverse().forEach(({ de, msg }) => {
    let html = `
      <div class="flex w-full justify-end">
        <div class="p-2 text-xl bg-blue-100 rounded-md w-max text-right">
          ${msg}
        </div>
      </div>`;

    if (de == selectedUser)
      html = `
        <div class="p-2 text-xl bg-white border w-max rounded-md">
          ${msg}
        </div>`;

    const msgItem = document.createElement('div');
    msgItem.innerHTML = html.trim();

    chat.appendChild(msgItem);
  });
};

if (!token) window.location = '../';
else main();
