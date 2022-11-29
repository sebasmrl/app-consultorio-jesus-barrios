const main = async () => {
  const usuario = await checkLogged();

  if (!usuario) return;

  document.getElementById('greeting').innerHTML += ` ${usuario.nombre}`;
};


const tokenStorage = localStorage.getItem('x-token');
if (!tokenStorage) window.location = '../';
else main();
