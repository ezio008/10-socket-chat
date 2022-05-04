const { Router } = require('express');
const { check } = require('express-validator');

const { postCategory,
    getCategories,
    getCategory,
    putCategory,
    deleteCategory } = require('../controllers/categories');
const { validateCategoryExist,
    validateCategoryNameExist } = require('../helpers/db-validators');
const { validateJWT,
    validateFields,
    isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories);

// verificar id categoria
// Obtener una categoria - publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateCategoryExist),
    validateFields
], getCategory);

// Crear categoria - privado
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('name').custom(validateCategoryNameExist),
    validateFields
], postCategory);

// Actualizar categoria - privado
router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateCategoryExist),
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('name').custom(validateCategoryNameExist),
    validateFields
], putCategory);

// Borrar categoria - privado - admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateCategoryExist),
    validateFields
], deleteCategory);

module.exports = router;