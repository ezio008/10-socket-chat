const { Router } = require('express');
const { check } = require('express-validator');
const { getSearch } = require('../controllers/search');
const { validateCollection, validateFields } = require('../middlewares');

const router = Router();

router.get('/:collection/:term', [
    validateCollection,
    validateFields
],getSearch);

module.exports = router;