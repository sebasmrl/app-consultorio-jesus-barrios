let socket;
let activos = [];
let usuario;

// return a promise
function copyToClipboard(textToCopy) {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // here the magic happens
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

const main = async () => {
  //Validar Token
  usuario = await checkLogged();

  if (!usuario) return;

  const { rol, uid } = usuario;

  if (rol !== 'ADMIN_ROLE') {
    window.location = './inicio.html';
    return;
  }

  console.log('Usuario:', uid);

  document.getElementById('genButton').onclick = generarHistorial;

  //Conectar Socket
  await conectarSocket();
};

const conectarSocket = async () => {
   socket = io(
    url,
    //`${location.protocol}//${location.host}/`, //url
    {
      path: '',
      //path: '/consultorio',
      extraHeaders: {
       'x-token': token,
      },
    }
  );

  //Eventos
  socket.on('connect', conectado);
  socket.on('disconnect', desconectado);
  socket.on('usuarios-activos', usuariosActivos);

  cargarUsuarios();
};

const cargarUsuarios = async (search = '@') => {
  const usuarios = document.getElementById('usuarios');

  const response = await (
    await fetch(`${url}buscar/${search}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  Array.from(usuarios.children).forEach(item => item.remove());

  usuarios.innerHTML = `
    <div class="flex flex-col md:flex-row gap-1 md:items-center justify-between w-full">
        <h1 class="text-2xl mr-3 flex-shrink-0 font-light">Usuarios</h1>
        <input id="search" name="search" placeholder="Busqueda..." type="text" class="
          bg-white outline-none
          p-2 flex-grow rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <div class="w-full md:w-auto flex gap-1 flex-shrink-0">
          <button 
              id="searchButton"
              class="
              flex-grow md:flex-grow-0
              bg-yellow-500
              p-2 material-icons-round
              text-white
              rounded-md
              flex-shrink-0
              focus:outline-none
          ">search</button>  
          <button 
              id="addButton"
              class="
              flex-grow md:flex-grow-0
              bg-blue-500
              p-2 material-icons-round
              text-white
              rounded-md
              flex-shrink-0
              focus:outline-none
          ">add</button>
          <button 
              id="downloadButton"
              class="
              flex-grow md:flex-grow-0
              bg-green-500
              p-2 material-icons-round
              text-white
              rounded-md
              flex-shrink-0
              focus:outline-none
          ">file_download</button> 
      </div>  
    </div>`;

  response.results
    .sort(a => (a.nombre.includes('Asesoría') ? -1 : 1))
    .forEach(us => {
      if (us.uid === usuario.uid) return;

      const item = document.createElement('div');

      item.innerHTML = `
        <div class="flex flex-col md:flex-row items-center gap-2 p-3 w-full bg-gray-100 rounded-xl overflow-hidden" id="item-${
          us.uid
        }">
          <div class="w-20 h-20 relative overflow-hidden">
            <img class="w-full h-full rounded-full object-cover" src="https://ui-avatars.com/api/?name=${
              us.nombre
            }&background=ACEEF3&color=041F60"/>
            <div class="absolute right-1.5 bottom-1.5 w-4 h-4 mt-2.5 -mb-1 rounded-full ${
              activos.includes(us.uid) ? 'bg-green-400' : 'bg-red-400'
            }"> </div>
          </div>
          <div class="flex flex-col flex-grow text-gray-500">
            <p class="text-xl text-gray-600">${us.nombre}</p>
            <p>Correo: ${us.correo} ${us.tel ? '| Telefono: ' + us.tel : ''} </p>
            <p>Rol: ${us.rol
              .replace('_ROLE', '')
              .replace('PATIENT', 'Usuario')
              .replace('ADMIN', 'Administrador')
              .replace('USER', 'Trabajador Social')}</p>
          </div>
          <div class="flex gap-1 justify-around w-full md:w-auto">
              <button 
                id="view-${us.uid}"
                class="material-icons-outlined text-gray-400 p-3 rounded-full bg-transparent transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-yellow-500 hover:bg-yellow-200">info</button>
              <button 
               onclick="copyToClipboard('${us.uid}')"         
               class="material-icons-round text-gray-400 p-3 rounded-full bg-transparent transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-blue-500 hover:bg-blue-200">copy</button>
              <button onclick="deleteUser('${
                us.uid
              }')" class="material-icons-round text-gray-400 p-3 rounded-full bg-transparent transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-red-500 hover:bg-red-200">delete</button>
          </div>
        </div>
      `.trim();

      usuarios.appendChild(item);
      document.getElementById('view-' + us.uid).onclick = () => viewUser(us);
    });

  document.getElementById('addButton').onclick = addUser;
  document.getElementById('downloadButton').onclick = downloadUsers;
  document.getElementById('searchButton').onclick = () =>
    cargarUsuarios(document.getElementById('search')?.value || '@');
};

const viewUser = usuario => {
  let { correo, nombre, rol, createdAt, tel, genero, text, motivo } = usuario;

  if (genero) {
    switch (genero) {
      case 'O':
        genero = 'Otro';
        break;

      case 'M':
        genero = 'Masculino';
        break;

      case 'F':
        genero = 'Femenino';
        break;

      default:
        break;
    }
  }

  Swal.fire({
    title: `
      <div class="flex gap-1 items-center justify-center">
        <i class="mt-1 material-icons-outlined">info</i>
        <span>${nombre}</span>
      </div>`,
    html: `
      <div class="relative flex items-center flex-col gap-1.5">
          <img class="w-28 h-28 rounded-full" src="https://ui-avatars.com/api/?name=${nombre}&background=ACEEF3&color=041F60" />
          <p class="text-xl">${correo}</p>
          <p>${tel || ''}</p>
          <p class="text-xl mt-3.5"><span class="font-medium">Genero:</span><br/>${genero}</p>
          ${text ? `<p class="mt-2"><span class="font-medium">Motivo:</span><br/>${motivo}</p>` : ''}

          ${motivo ? `<p class="mt-2"><span class="font-medium">Enteramiento:</span><br/>${text}</p>` : ''}

          <p class="mt-5 font-medium">${rol
            .replace('_ROLE', '')
            .replace('PATIENT', 'Usuario')
            .replace('ADMIN', 'Administrador')
            .replace('USER', 'Trabajador Social')}
          </p>
          <p class="text-gray-400 mt-10">
          Usuario desde:
          ${new Date(createdAt).toLocaleDateString() + ' ' + tConv24(new Date(createdAt).toLocaleTimeString())}</p>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    focusConfirm: false,
  });
};

const downloadUsers = async () => {
  const response = await (
    await fetch(`${url}usuarios/tabla`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).blob();

  if (response.msg || response.errors) return console.log('Error');

  downloadBlob(response, 'Usuarios.xlsx');
};

const deleteUser = async uid => {
  const response = await (
    await fetch(`${url}usuarios/${uid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  cargarUsuarios();
};

const addUser = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Nuevo Usuario',
    html: `
      <div class="flex flex-col gap-2 items-start w-full p-2">
        <input id="swal-input1" name="correo" placeholder="Correo..." type="email" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-inputName" name="nombre" placeholder="Nombre..." type="name" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-input2" name="password" placeholder="Contraseña..." type="password" autocomplete="new-password" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-input-tel" name="tel" placeholder="Telefono..." type="phone" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">

        <label for="gen-select">Genero:</label>
        <select name="genero" id="gen-select" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
          <option value="M" default>Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>

        <label for="rol-select">Rol:</label>
        <select name="rol" id="rol-select" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
          <option value="USER_ROLE" default>Trabajador Social</option>
          <option value="PATIENT_ROLE">Paciente</option>
          <option value="ADMIN_ROLE">Administrador</option>
        </select>
      </div>
      `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-input1').name]: document.getElementById('swal-input1').value,
        [document.getElementById('swal-inputName').name]: document.getElementById('swal-inputName').value,
        [document.getElementById('swal-input2').name]: document.getElementById('swal-input2').value,
        [document.getElementById('swal-input-tel').name]: document.getElementById('swal-input-tel').value,
        [document.getElementById('rol-select').name]: document.getElementById('rol-select').value,
        [document.getElementById('gen-select').name]: document.getElementById('gen-select').value,
      };
    },
    confirmButtonText: 'Añadir',
  });

  if (!formValues) return;

  let error;
  const { tel, text, ...rest } = formValues;

  if (Object.values(rest).includes('', undefined, null) && !error)
    error = await Swal.fire('Alerta', 'Debe Llenar Todos los Campos', 'warning');

  if (
    !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      formValues.correo
    ) &&
    !error
  )
    error = await Swal.fire('Error', 'Email Invalido', 'error');

  if (formValues.password.length < 6 && !error)
    error = await Swal.fire('Error', 'La Contraseña debe Tener Minimo 6 Caracteres', 'error');

  if (error) return addUser();

  //AddUser
  const response = await (
    await fetch(`${url}usuarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
      body: JSON.stringify({ ...formValues, estudios: 'Profesional' }),
    })
  ).json();

  if (response.msg || response.errors) return Swal.fire('Error', 'No se Pudo Crear el Usuario', 'error');

  cargarUsuarios();
};

const generarHistorial = async () => {
  const de = document.getElementById('us1').value;
  const para = document.getElementById('us2').value;

  const response = await (
    await fetch(`${url}mensajes/historial?de=${de}&para=${para}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).blob();

  if (response.msg || response.errors) return console.log('Error');

  downloadBlob(response, 'Historial.xlsx');
};

const tConv24 = time24 => {
  let ts = time24;
  let H = +ts.substr(0, 2);
  let h = H % 12 || 12;
  h = h < 10 ? '0' + h : h; // leading 0 at the left for 1 digit hours
  let ampm = H < 12 ? ' AM' : ' PM';
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};

if (!token) window.location = '../';
else main();
