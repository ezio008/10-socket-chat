const { Router } = require('express');
const { check } = require('express-validator');
const { postFile, postImg, getImage, postImgCloudinary } = require('../controllers/uploads');
const { validateCollections } = require('../helpers');
const { validateFields, validateFile, validateJWT, validateCollection } = require('../middlewares');

const router = new Router();

router.post('/',[
    validateFile,
    validateFields
], postFile);

router.post('/:collection/:id',[
    validateJWT,
    check('collection').custom(c => validateCollections(c, ['users', 'products'])),
    check('id', 'Id no valido').isMongoId(),    
    validateFile,
    validateFields
], postImgCloudinary);

router.get('/:collection/:id',[
    check('collection').custom(c => validateCollections(c, ['users', 'products'])),
    check('id', 'Id no valido').isMongoId(),        
    validateFields
], getImage);

module.exports = router;