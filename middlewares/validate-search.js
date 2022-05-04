const { request, response } = require("express");

const collections = ['products', 'categories', 'users', 'roles'];

const validateCollection = (req = request, res = response, next) => {

    const { collection } = req.params;

    if(!collection) {
        return res.status(400).json({
            msg:'La colección no puede estar vacia'
        });
    }

    if(!collections.includes(collection)) {
        return res.status(400).json({
            msg:`Las colecciones permitidas son ${collections}`
        });
    }


    next();
}

module.exports = {
    validateCollection
}