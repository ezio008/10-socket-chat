const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renovateToken } = require('../controllers/auth');
const { validateNotExistEmail, validateUserActive } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', [
    validateJWT,
    validateFields
], renovateToken);

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('email').custom(validateNotExistEmail),
    check('email').custom(validateUserActive),
    check('password', 'la contraseña es obligatoria').notEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token es necesario').notEmpty(),
    validateFields
], googleSignIn);

module.exports = router;