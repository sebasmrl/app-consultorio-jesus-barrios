const main = async () => {
  //Validar Token
  const usuario = await checkLogged();

  if (!usuario) return;

  let {
    uid,
    correo,
    nombre,
    rol,
    createdAt,
    tel,
    genero,
    estado,
    seguridad,
    nacimiento,
    ciudad,
    carrera,
    semestre,
    ocupacion,
    estudios,
  } = usuario;

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

  //User HTML References
  document.getElementById(
    'profile-pic'
  ).src = `https://ui-avatars.com/api/?name=${nombre}&background=ACEEF3&color=041F60&size=256`;

  document.getElementById('usName').value = nombre || '';
  document.getElementById('usMail').value = correo || '';
  document.getElementById('usTel').value = tel || '';
  document.getElementById('usGen').value = genero || '';
  document.getElementById('usEstado').value = estado || '';
  document.getElementById('usSeg').value = seguridad || '';

  document.getElementById('usFecha').innerHTML += ' ' + (nacimiento || '-') + ', ' + (ciudad || '-');

  document.getElementById('usCar').value = carrera || '';
  document.getElementById('usSem').value = semestre || '';
  document.getElementById('usOcu').value = ocupacion || '';
  document.getElementById('usEstu').value = estudios || '';

  document.getElementById('usRol').innerHTML =
    'Rol: ' +
    rol
      .replace('_ROLE', '')
      .replace('PATIENT', 'Usuario')
      .replace('ADMIN', 'Administrador')
      .replace('USER', 'Trabajador Social');

  document.getElementById('usDate').innerHTML =
    'Usuario desde: ' +
    new Date(createdAt).toLocaleDateString() +
    ' - ' +
    tConv24(new Date(createdAt).toLocaleTimeString());

  // Save new user data

  document.getElementById('saveButton').addEventListener('click', async () => {
    const updated = {
      nombre: document.getElementById('usName').value,
      correo: document.getElementById('usMail').value,
      tel: document.getElementById('usTel').value,
      genero: document.getElementById('usGen').value,
      estado: document.getElementById('usEstado').value,
      seguridad: document.getElementById('usSeg').value,

      carrera: document.getElementById('usCar').value,
      semestre: document.getElementById('usSem').value,
      ocupacion: document.getElementById('usOcu').value,
      estudios: document.getElementById('usEstu').value,
    };

    // Update
    const response = await (
      await fetch(`${url}usuarios/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-token': token },
        body: JSON.stringify(updated),
      })
    ).json();

    if (response.msg || response.errors) return Swal.fire('Error', 'No se Pudo Actualizar su Información', 'error');

    Swal.fire('Actualizado', 'Su Información Fue Actualizada', 'success');
  });
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
