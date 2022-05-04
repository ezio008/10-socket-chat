const validateFields = require('../middlewares/validate-fields');
const validateFiles = require('../middlewares/validate-files');
const validateJWT = require('../middlewares/validate-jwt');
const validateProducts = require('../middlewares/validate-products');
const validateRoles = require('../middlewares/validate-roles');
const validateSearch = require('../middlewares/validate-search');

module.exports = {
    ...validateFields,
    ...validateFiles,
    ...validateJWT,
    ...validateProducts,
    ...validateRoles,
    ...validateSearch
}
