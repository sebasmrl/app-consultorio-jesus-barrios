const preguntarSesion = () => {
  Swal.fire({
    heightAuto: false,
    title: 'Elija una Acción',
    html: `
    <div class="w-full flex items-center justify-center my-5 gap-2">

        
        <a
            href="./access/login.html"
            class="
                bg-blue-500
                p-2
                flex-grow
                md:flex-grow-0
                text-white
                rounded-md
                flex-shrink-0
                focus:outline-none"
            >
            Iniciar Sesión
        </a>
        <a
            href="./registro.html"
            class="
                bg-purple-500
                p-2
                flex-grow
                md:flex-grow-0
                text-white
                rounded-md
                flex-shrink-0
                focus:outline-none"
            >
            Registrarse
        </a>
    
    </div>
    
    `,
    icon: 'question',
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Cerrar',
  });
};
