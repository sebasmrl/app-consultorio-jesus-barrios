let usuario;

const main = async () => {
  usuario = await checkLogged();

  if (!usuario) return;

  document.getElementById('searchButton').addEventListener('click', search);

  await search();

  if (usuario.rol !== 'ADMIN_ROLE') return;

  const addButton = document.createElement('button');
  addButton.onclick = addVideo;
  addButton.innerHTML = 'add';

  addButton.className = `
    bg-blue-500
    p-2 flex-grow md:flex-grow-0
    material-icons-round
    text-white
    rounded-md
    flex-shrink-0
    focus:outline-none
  `;

  document.getElementById('buttons').appendChild(addButton);
};

const search = async () => {
  const busqueda = document.getElementById('search').value;

  const query = `
    ${busqueda === '' ? `?busqueda=${busqueda}` : ''}
  `
    .replace(/\s/g, '')
    .trim();

  const response = await (
    await fetch(`${url}videos/${query}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  document.getElementById('count').innerHTML = 'Resultados: ' + response.total;

  cargarVideos(response.videos);
};

const deleteVideo = async uid => {
  const response = await (
    await fetch(`${url}videos/${uid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  search();
};

const cargarVideos = async videos => {
  const items = document.getElementById('videos');

  items.innerHTML = '';

  videos?.forEach(({ nombre, tipo, link, _id }) => {
    const libro = document.createElement('div');

    libro.className = `
      p-3 
      flex flex-col
      justify-between
      w-80
      h-36
      gap-2
      rounded-lg
      shadow-md
      border
    `;

    libro.innerHTML = `
      <div class="flex items-start justify-between gap-2 w-full h-2/3">
        <i
          class="material-icons-round text-yellow-500"
          style="font-size: 40px"
          >play_circle</i
        >
        <div class="h-full flex flex-col flex-grow overflow-hidden">
          <h1 class="font-medium text-xl h-auto text-gray-700">
            ${nombre}
          </h1>
          <p class="truncate flex-shrink-0">${tipo}</p>
        </div>
      </div>
      <div class="flex items-end justify-between gap-1">
        <a href="${link}" target="_blank" class="font-medium text-blue-400 w-max">Ver</a>
        ${
          usuario.rol === 'ADMIN_ROLE'
            ? `<button onclick="deleteVideo('${_id}')" class="material-icons-round text-gray-400 transform transition-all duration-200 ease-in outline-none focus:outline-none hover:text-red-500">delete</button>`
            : ''
        }
      </div>
    `;

    items.appendChild(libro);
  });
};

const addVideo = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Nuevo Video',
    html: `
      <div class="flex flex-col relative gap-2 items-start w-full p-2">
        <input id="swal-inputName" name="nombre" placeholder="Nombre..." type="text" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-inputLink" name="link" placeholder="Link..." type="link" class="
        bg-white outline-none
        p-2 w-full rounded-md border
        transform transition-all duration-300
        focus:outline-none focus:bg-gray-50
        ">
        <input id="swal-inputTipo" name="tipo" placeholder="Tipo..." type="text" class="
          bg-white outline-none
          p-2 w-full rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        ">
      </div>
      `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-inputName').name]: document.getElementById('swal-inputName').value,
        [document.getElementById('swal-inputLink').name]: document.getElementById('swal-inputLink').value,
        [document.getElementById('swal-inputTipo').name]: document.getElementById('swal-inputTipo').value,
      };
    },
    confirmButtonText: 'Añadir',
  });

  if (!formValues) return;

  if (Object.values(formValues).includes('', undefined, null))
    return await Swal.fire('Alerta', 'Debe Llenar Todos los Campos', 'warning').then(addVideo);

  if (!verificarURL(formValues.link)) return await Swal.fire('Error', 'Link no valido', 'error').then(addVideo);

  //AddVideo
  const response = await (
    await fetch(`${url}videos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
      body: JSON.stringify(formValues),
    })
  ).json();

  if (response.msg || response.errors) return Swal.fire('Error', 'No se Pudo Añadir el Video', 'error');

  search();
};

main();
