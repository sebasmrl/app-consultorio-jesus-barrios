const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
  videosGet,
  videosPost,
  videosDelete,
} = require('../controllers/videos');

const router = Router();

router.get('/', validarJWT, videosGet);

router.post(
  '/',
  [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('tipo', 'El tipo es obligatorio').not().isEmpty(),
    check('link', 'El link es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  videosPost
);

router.delete('/:id', [validarJWT, esAdminRole], videosDelete);

module.exports = router;
