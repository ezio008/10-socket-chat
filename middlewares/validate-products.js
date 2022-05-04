const { request, response } = require("express");
const { Category } = require("../models");

const validatePrice = (req = request, res = response, next) => {

    const { price } = req.body;

    if (price) {
        if (isNaN(price)) {
            return res.status(400).json({
                msg: 'Precio tiene que ser un número'
            });
        }
    }

    next();
}

const validateInStock = (req = request, res = response, next) => {

    const { inStock } = req.body;

    if (inStock !== undefined) {
        if (toString.call(inStock) !== '[object Boolean]') {
            return res.status(400).json({
                msg: 'Stock tiene que ser un booleano'
            });
        }
    }

    next();
}

const validateCategory = async (req = request, res = response, next) => {

    const { category } = req.body;

    if (category) {
        try {
            const categoryBD = await Category.findById(category);
            if (!categoryBD) {
                return res.status(400).json({
                    msg: `La categoria con id ${category} no existe`
                });
            }
        } catch (error) {
            return res.status(400).json({
                msg: 'Id de categoria no valido'
            });
        }
    }

    next();
}

module.exports = {
    validatePrice,
    validateInStock,
    validateCategory
}