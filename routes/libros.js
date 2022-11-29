const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
  librosGet,
  librosPost,
  librosDelete,
} = require('../controllers/libros');

const router = Router();

router.get('/', validarJWT, librosGet);

router.post(
  '/',
  [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('autor', 'El autor es obligatorio').not().isEmpty(),
    check('link', 'El link es obligatorio').not().isEmpty(),
    check('facultad', 'La facultad es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  librosPost
);

router.delete('/:id', [validarJWT, esAdminRole], librosDelete);

module.exports = router;
