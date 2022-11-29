const form = document.getElementById('regForm');

const registrarUsuario = async () => {
  const formData = new FormData(form);

  let json = {};
  formData.forEach((value, key) => (json[key] = value));

  if (!json) return;

  let error;

  // const { tel, text, motivo, ocupacion, carrera, ciudad, nacimiento, ...rest } =
  //   json;

  if (Object.values(json).includes('', undefined, null) && !error)
    error = await Swal.fire('Alerta', 'Debe Llenar Todos los Campos', 'warning');

  if (
    !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      json.correo
    ) &&
    !error
  )
    error = await Swal.fire('Error', 'Email Invalido', 'error');

  if (json.password.length < 6 && !error)
    error = await Swal.fire('Error', 'La Contraseña debe Tener Minimo 6 Caracteres', 'error');

  if (`${json.password}` !== `${json.confPassword}`)
    error = await Swal.fire('Error', 'Las Contraseñas no Coinciden.', 'error');

  //   json.nacimiento = json.nacimiento !== '' ? new Date(json.nacimiento) : '';

  // return console.log(json);

  if (error) return;

  //Registro
  try{

    const response = await (
      //--------------------------------------------------
      //modificar ruta usuarios/ para registro y enviar el correo en eun middleware
      await fetch(`${url}usuarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
        body: JSON.stringify(json),
      })
    ).json();

    if (response.msg || response.errors) return Swal.fire('Error', 'No se Pudo Crear el Usuario', 'error');

    await login({ correo: json.correo, password: json.password }, swal);
  } catch(err){
 	console.log(err)
  }
};

form.onsubmit = e => {
  e.preventDefault();
  registrarUsuario();
};

// document.getElementById('registerButton').onclick = registrarUsuario;
