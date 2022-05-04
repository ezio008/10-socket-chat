const { response } = require("express");
const { request } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const searchUsers = async (term = '', res = response) => {
    const esMongoID = ObjectId.isValid(term);

    if (esMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [
            { name: regex },
            { email: regex }
        ],
        $and: [
            { state: true }
        ]
    });

    return res.json({
        results: users
    });
}

const searchCategories = async (term = '', res = response) => {
    const esMongoID = ObjectId.isValid(term);

    if (esMongoID) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Category.find({
        $and: [
            { name: regex },
            { state: true }
        ]
    });

    return res.json({
        results: categories
    });
}

const searchProducts = async (term = '', res = response) => {
    const esMongoID = ObjectId.isValid(term);

    if (esMongoID) {
        const product = await Product.findById(term)
            .populate('category', 'name')
            .populate('user', 'name');
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({
        $or: [
            { name: regex },
            { description: regex }
        ],
        $and: [
            { state: true }
        ]
        }).populate('category', 'name')
        .populate('user', 'name');

    return res.json({
        results: products
    });
}

const getSearch = async (req = request, res = response) => {
    const { collection, term } = req.params;

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'users':
            searchUsers(term, res);
            break;
        default:
            return res.status(500).json({
                msg: 'No existe esta busqueda'
            })
    }
}

module.exports = {
    getSearch
}