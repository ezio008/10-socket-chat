const { Router } = require('express');
const { check } = require('express-validator');

const { getProducts,
    getProduct,
    postProduct,
    putProduct,
    deleteProduct } = require('../controllers/products');
const { validateCategoryExist, 
    validateProductNameExist, 
    validateProductExist } = require('../helpers/db-validators');
const { validateJWT, 
    validateFields, 
    isAdminRole, 
    validatePrice, 
    validateInStock, 
    validateCategory } = require('../middlewares');

const router = Router();

// Obtener todos los productos
router.get('/', getProducts);

// Obtener un producto
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateProductExist),
    validateFields
], getProduct);

// Crear producto
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('name').custom(validateProductNameExist),
    check('category', 'No es un ID valido').isMongoId(),
    check('category').custom(validateCategoryExist),
    validatePrice,
    validateInStock,
    validateFields
], postProduct);

// Actualizar producto
router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateProductExist),
    validateCategory,
    validatePrice,
    validateInStock,
    validateFields
], putProduct);

// Eliminar producto
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(validateProductExist),
    validateFields
], deleteProduct);

module.exports = router;