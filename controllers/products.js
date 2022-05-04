const { response } = require("express");
const { request } = require("express");
const { Product } = require('../models');

// Obtener productos - paginados
const getProducts = async (req = request, res = response) => {
    const { limit = 5, start = 0 } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        totalFiltered: products.length,
        products
    });
}

// Obtener un producto
const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.json({
        product
    });
}

// Crear producto
const postProduct = async (req = request, res = response) => {
    const { name, category, price = 0, description = '', inStock = true } = req.body;

    try {

        const data = {
            name,
            user: req.user._id,
            category,
            price,
            description,
            inStock
        }

        const product = new Product(data);

        await product.save();

        res.status(201).json({ product });

    } catch (error) {
        res.status(500).json({
            msg: 'Error en el servidor',
            error
        })
    }
}

// Actualizar producto
const putProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const productDB = await Product.findById(id)
        .populate('category', 'name');

    const { name = productDB.name,
        category = productDB.category._id,
        price = productDB.price,
        description = productDB.description,
        inStock = productDB.inStock } = req.body;

    try {

        const data = {
            name,
            user: req.user._id,
            category,
            price,
            description,
            inStock
        }

        const product = await Product.findByIdAndUpdate(id, data, { new: true })
            .populate('user', 'name')
            .populate('category', 'name');

        res.status(200).json({ product });

    } catch (error) {
        res.status(500).json({
            msg: 'Error en el servidor',
            error
        })
    }

}

// Borrar producto
const deleteProduct = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const data = {
            state: false
        };

        const product = await Product.findByIdAndUpdate(id, data, { new: true })
            .populate('user', 'name')
            .populate('category', 'name');

        res.json({
            product
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor',
            error
        })
    }
}

module.exports = {
    deleteProduct,
    getProducts,
    getProduct,
    postProduct,
    putProduct,
}