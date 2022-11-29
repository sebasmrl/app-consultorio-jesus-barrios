const { Router } = require('express');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

const { validarCampos, validarJWT } = require('../middlewares/index');

const { login, renovarToken, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

router.get('/validateToken',[
  async(req, res, next)=>{
    const token =  req.header('x-token');

    try {
      const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
      next()
    } catch (error) {
      return res.status(400).json({ validate: false})
    }
    
  }
], (req, res)=>{

  res.status(200).json({ validate: true});
});


router.post('/google',[
  check('id_token', 'El id_token es necesario').not().isEmpty(),
  validarCampos,
] ,googleSignIn )

router.get('/', validarJWT, renovarToken);


module.exports = router;
