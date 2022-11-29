const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');

const {
  mensajesGet,
  mensajesPost,
  historial,
} = require('../controllers/mensajes');

const router = Router();

router.get('/', validarJWT, mensajesGet);

router.get('/historial', validarJWT, historial);

router.post(
  '/',
  [
    validarJWT,
    check('de', 'El remitente es obligatorio').not().isEmpty(),
    check('para', 'El destinatario es obligatorio').not().isEmpty(),
    check('msg', 'El mensaje es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  mensajesPost
);

module.exports = router;
