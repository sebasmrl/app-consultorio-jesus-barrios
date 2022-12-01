// const url = 'http://site.curn.edu.co:8067/consultorio/api/';
// const url = 'http://localhost:8080/api/';
const url = `${location.protocol}//${location.host}/api/`
//import { tok} from '../js/biblioteca'
const token = localStorage.getItem('x-token');

const login = async (data, swal) => {
  const response = await (
    await fetch(url + 'auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  ).json();

  if (response.errors || response.msg) return swal.fire('Error', 'Revise los datos e intente nuevamente', 'error');

  sessionStorage.setItem('token', response.token);
  sessionStorage.setItem('x-token', response.token);
  localStorage.setItem('x-token', response.token);

  window.location.replace( url+'paginas/inicio.html');
};

const logout = async () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('x-token');
  localStorage.removeItem('x-token');
  window.location = '../';
  if (socket) socket.disconnect();
}; 

const downloadBlob = (blob, name = 'file.txt') => {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  // Remove link from body
  document.body.removeChild(link);
};

const checkLogged = async () => {
  //Validar Token
  const response = await (
    await fetch(url + 'auth/', {
      headers: {
        'Content-Type': 'application/json',
        'x-token': token,
      },
    })
  ).json();

  if (response.msg) {
    console.log('Validation Failed');

    return (window.location = '../');
  }
  
  return response.usuario;
};

const verificarURL = string => {
  let url;

  try {
    url = new URL(string);
  } catch (err) {
    return false;
  }

  return url;
};

/*
export {
  login, 
  logout,
  downloadBlob, 
  checkLogged, 
  verificarURL
}
*/