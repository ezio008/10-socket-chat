
const { Router } = require('express');
const { check } = require('express-validator');

const { validateRole, validateEmail, validateIdExist } = require('../helpers/db-validators');
const { validateFields, haveRole, validateJWT, isAdminRole } = require('../middlewares');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/users');

const router = Router();

router.get('/',usersGet);

router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('password', 'La contraseña debe ser de mas letras').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(validateEmail),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(validateRole),
    validateFields
], usersPost);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validateIdExist),
    check('role').custom(validateRole),
    validateFields
], usersPut);

router.delete('/:id', [
    validateJWT,
    // isAdminRole, // si tiene que ser administrador
    haveRole('ADMIN_ROLE', 'SALES_ROLE'), // si tiene que pertenecer a uno de los roles indicados
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(validateIdExist),
    validateFields
], usersDelete);

router.patch('/', usersPatch);

module.exports = router;