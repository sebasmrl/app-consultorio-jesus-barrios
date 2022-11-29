const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  tabla,
} = require('../controllers/usuarios');
const { enviarEmail } = require('../middlewares/emailSending');

const router = Router();

router.get('/', usuariosGet);

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos,
    enviarEmail,
  ],
  usuariosPost
);

router.delete(
  '/:id',
  [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);

router.get('/tabla', [validarJWT, tieneRole('ADMIN_ROLE')], tabla);

module.exports = router;
