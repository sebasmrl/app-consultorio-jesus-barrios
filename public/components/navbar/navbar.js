const iniciarSesion = async () => {
  const { value: formValues } = await Swal.fire({
    heightAuto: false,
    icon: 'info',
    title: 'Iniciar Sesión',
    html: `
            <div class="flex flex-col gap-2 items-start w-full p-2">
              <input id="swal-input1" name="correo" placeholder="Correo..." type="email" class="
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
            </div>
            `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        [document.getElementById('swal-input1').name]: document.getElementById('swal-input1').value,
        [document.getElementById('swal-input2').name]: document.getElementById('swal-input2').value,
      };
    },
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cerrar',
  });

  if (!formValues) return;

  let error;

  if (Object.values(formValues).includes('', undefined, null) && !error)
    error = await Swal.fire('Alerta', 'Debe Llenar Todos los Campos', 'warning');

  if (error) return iniciarSesion();

  //Login
  await login(formValues, Swal);
};
