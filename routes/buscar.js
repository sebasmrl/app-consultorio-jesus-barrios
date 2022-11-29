const { Router } = require('express');
const {
  buscarUsuarios,
  buscarChatsConAdmin,
} = require('../controllers/buscar');

const { validarJWT } = require('../middlewares/');

const router = Router();

router.get('/:termino', validarJWT, buscarUsuarios);
router.get('/extra/buscarChatsConAdmin', validarJWT, buscarChatsConAdmin);

module.exports = router;
