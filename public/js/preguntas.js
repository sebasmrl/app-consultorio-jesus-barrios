let usuario;

const main = async () => {
  usuario = await checkLogged();

  if (!usuario) return;

  document.getElementById('searchButton').addEventListener('click', search);

  const addButton = document.createElement('button');
  addButton.onclick = addPregunta;
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

  await search();
};

const search = async () => {
  const busqueda = document.getElementById('search').value;

  const query = `
    ${busqueda === '' ? `?busqueda=${busqueda}` : ''}
  `
    .replace(/\s/g, '')
    .trim();

  const response = await (
    await fetch(`${url}preguntas/${query}`, {
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
  ).json();

  if (response.msg || response.errors) return console.log('Error');

  document.getElementById('count').innerHTML = 'Resultados: ' + response.total;

  cargarPreguntas(response.preguntas);
};

const cargarPreguntas = async preguntas => {
  const items = document.getElementById('preguntas');

  items.innerHTML = '';

  preguntas?.forEach(({ texto, usuario: nombre, respuesta, administrador, _id }) => {
    const pregunta = document.createElement('div');

    pregunta.className = `
      flex flex-col
      justify-between
      w-full
      h-auto
      gap-4
    `;

    pregunta.innerHTML = `
        <div class="flex-grow border shadow-md rounded-lg p-3">
            <h1 class="font-medium text-xl h-auto text-gray-700">
                ${texto}
            </h1>
            <p class="truncate flex-shrink-0 text-gray-600 font-light">- ${nombre}</p>
        </div>

        ${
          respuesta
            ? `
        <div class="pl-2 flex-grow flex gap-5 items-center">
            <i class="material-icons-round text-purple-800" style="font-size:30px">
                subdirectory_arrow_right
            </i>
            <div class="flex-grow flex flex-col justify-end border border-purple-100 bg-purple-50 shadow-md rounded-lg p-3">
                <h1 class="font-medium text-xl h-auto text-purple-900">
                    ${respuesta}
                </h1>
                <p class="truncate flex-shrink-0 text-purple-800 font-light">- ${administrador}</p>
            </div>
        </div>
        `
            : usuario.rol === 'ADMIN_ROLE'
            ? `
                <div class="flex gap-2 pl-2 items-center">
                    <i class="material-icons-round text-purple-800">
                        east
                    </i>
                    <button onclick="responderPregunta('${texto}', '${_id}')" class="w-max bg-purple-100 text-purple-800 p-2 text-white rounded-md flex-shrink-0 focus:outline-none">
                        Responder
                    </button>
                </div>
            `
            : ''
        }
    `;

    items.appendChild(pregunta);
  });

  items.innerHTML += '<br/><br/>';
};

const addPregunta = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Nueva Pregunta',
    html: `
      <div class="flex flex-col relative gap-2 items-start w-full p-2">
        <textarea id="swal-inputText" name="texto" placeholder="Su pregunta..." type="text" class="
          bg-white outline-none
          p-2 w-full h-32 rounded-md border
          transform transition-all duration-300
          focus:outline-none focus:bg-gray-50
        "></textarea>
      </div>
      `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-inputText').name]: document.getElementById('swal-inputText').value,
      };
    },
    confirmButtonText: 'Añadir',
  });

  if (!formValues) return;

  if (Object.values(formValues).includes('', undefined, null))
    return await Swal.fire('Alerta', 'Debe Llenar Todos los Campos', 'warning').then(addPregunta);

  //AddPregunta
  const response = await (
    await fetch(`${url}preguntas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
      body: JSON.stringify({ ...formValues, usuario: usuario.nombre }),
    })
  ).json();

  if (response.msg || response.errors) return Swal.fire('Error', 'No se Pudo Añadir la Pregunta', 'error');

  search();

  Swal.fire('Pregunta Enviada', 'Sera Respondida lo Antes Posible.', 'success');
};

const responderPregunta = async (texto, _id = '') => {
  const { value: formValues } = await Swal.fire({
    title: 'Responder Pregunta',
    html: `
        <div class="flex flex-col relative gap-2 items-start w-full p-2">
            <p>${texto}</p>
            <textarea id="swal-inputText" name="respuesta" placeholder="Su respuesta..." type="text" class="
                bg-white outline-none
                p-2 w-full h-32 rounded-md border
                transform transition-all duration-300
                focus:outline-none focus:bg-gray-50
            "></textarea>
        </div>
        `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-inputText').name]: document.getElementById('swal-inputText').value,
      };
    },
    confirmButtonText: 'Responder',
  });

  if (!formValues) return;

  if (Object.values(formValues).includes('', undefined, null))
    return await Swal.fire('Alerta', 'Debe Llenar Todos los Campos', 'warning').then(addPregunta);

  //responderPregunta
  const response = await (
    await fetch(`${url}preguntas/${_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
      body: JSON.stringify({
        ...formValues,
        administrador: usuario.nombre,
        solved: true,
      }),
    })
  ).json();

  if (response.msg || response.errors) return Swal.fire('Error', 'No se Pudo Responder la Pregunta', 'error');

  search();

  Swal.fire('Respuesta Enviada', 'La Pregunta fue Respondida Satisfactoriamente.', 'success');
  
};

main();
