const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
  preguntasGet,
  preguntasPost,
  preguntasPut,
  preguntasDelete,
} = require('../controllers/preguntas');

const router = Router();

router.get('/', validarJWT, preguntasGet);

router.post(
  '/',
  [
    validarJWT,
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('texto', 'El texto es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  preguntasPost
);

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('administrador', 'El administrador es obligatorio').not().isEmpty(),
    check('respuesta', 'La respuesta es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  preguntasPut
);

router.delete('/:id', [validarJWT, esAdminRole], preguntasDelete);

module.exports = router;
