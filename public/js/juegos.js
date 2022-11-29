const juegos = [
  {
    nombre: 'Love Pins',
    link: 'https://www.juegos.com/juego/love-pins',
    pagina: 'YAD.com',
    descripcion:
      'Love Pins es un juego en línea encantador. Ayuda a un novio a llegar hasta su enamorada evitando enemigos y trampas peligrosas. Tendrás que ir retirando las barreras en el orden adecuado para evitar que ataquen a los tortolitos.',
  },
  {
    nombre: 'Lichess',
    link: 'https://lichess.org/',
    pagina: 'lichess.org',
    descripcion: 'ichess es un servidor de ajedrez libre, gratuito y sin publicidad.',
  },
  {
    nombre: 'DAMAS',
    link: 'https://www.ajedrezeureka.com/damas/',
    pagina: 'ajedrezeureka.com',
    descripcion:
      'El clásico juego de las Damas contra el ordenador. Aquí puedes enfrentar y practicar el juego de las Damas con tu computadora o móvil.',
  },
  {
    nombre: 'SUDOKU',
    link: 'https://www.sudoku-online.org/',
    pagina: 'sudoku-online.org',
    descripcion:
      'El Sudoku es un rompecabezas de lógica y uno de los pasatiempos que más engancha. El objetivo es rellenar una cuadrícula de 9×9 celdas dividida en subcuadrículas de 3×3 con las cifras del 1 al 9 partiendo de algunos números ya dispuestos en algunas de las celdas.',
  },
  {
    nombre: 'Sopa De Letras',
    link: 'https://buscapalabras.com.ar/jugar-sopa-de-letras.php',
    pagina: 'buscapalabras.com.ar',
    descripcion: '',
  },
  {
    nombre: 'Preguntados',
    link: 'https://www.juegos.net/juego/preguntados',
    pagina: 'juegos.net',
    descripcion: 'En este test, se ven preguntas tanto de arte, como de ciencia, historia, cine y televisión y mas.',
  },
  {
    nombre: 'UNO Online',
    link: 'https://www.1001juegos.com/juego/uno-online',
    pagina: '1001juegos.com',
    descripcion:
      'Uno Online te permite jugar al popular juego de cartas UNO en tu navegador web. El objetivo del juego es ser el primero en quedarse sin cartas.',
  },
  {
    nombre: 'El Ahorcado',
    link: 'http://pasatiempos.elmundo.es/ahorcado/ahorcado.html',
    pagina: 'pasatiempos.elmundo.es',
    descripcion: '',
  },
];

const contenedor = document.getElementById('juegosItems');

juegos.forEach(({ nombre, link, pagina, descripcion }) => {
  const j = document.createElement('div');

  j.innerHTML = `
  <div
    class="
        relative
        flex
        w-full
        md:items-center
        p-5
        z-50
        gap-5 overflow-hidden
        h-auto md:h-44
        rounded-lg
        shadow-md
    "
    >
        <i
            class="material-icons-round text-pink-100 transform -rotate-12 z-50 gamesIcon"
            >extension</i
        >
        <div class="z-50 flex flex-col gap-1 h-full">
            <p class="text-3xl font-light text-pink-800">${nombre}</p>
            <p class="text-xl">
                ${descripcion}
            </p>
            <a
            href="${link}"
            target="_blank"
            class="flex items-center w-max gap-1 mt-2"
            >
                <i class="material-icons-round text-purple-800">launch</i>
                <span class="font-medium text-purple-800"> Jugar - ${pagina} </span>
            </a>
        </div>

        <!-- Decoration -->
        <i
            class="
            absolute
            text-gray-100
            material-icons-round
            z-0
            top-2
            right-2
            "
            style="font-size: 40px"
            >extension</i
        >
    </div>`;

  contenedor.appendChild(j);
});

checkLogged();
