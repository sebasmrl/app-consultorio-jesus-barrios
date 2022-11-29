const initNav = async () => {
  //Validar Token
  const response = await (
    await fetch(url + 'auth/', {
      headers: {
        'Content-Type': 'application/json',
        'x-token': token || localStorage.getItem('x-token'),
      },
    })
  ).json();

  if (response.msg) {
    console.log('Validation Failed');

    return (window.location = '../');
  }

  const {
    usuario: { correo, rol },
  } = response;

  document.getElementById('navMail').innerHTML = correo;
  document.getElementById('logout-button').onclick = logout;

  if (rol === 'ADMIN_ROLE') {
    const estadisticas = document.createElement('a');

    estadisticas.className = `
    w-auto md:text-xl
    p-1 md:p-3
    h-12 md:h-full
    rounded-sm
    flex
    justify-center
    items-center
    transform
    transition-all
    duration-100
    ease-in
    hover:bg-opacity-10 hover:bg-black
    `;

    estadisticas.innerHTML = 'Estadisticas';
    estadisticas.href = './estadisticas.html';

    document.getElementById('navItems').appendChild(estadisticas);
  }
};

if (!token) window.location = '../';
else initNav();
