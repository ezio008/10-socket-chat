const { response } = require("express");
const { request } = require("express");
const { Category } = require('../models');

// obtener categorias - paginado - total - populate
const getCategories = async (req = request, res = response) => {
    const { limit = 5, start = 0 } = req.query;
    const query = { state: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(start))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        totalFiltered: categories.length,
        categories
    });

}

// obtener categoria - populate {}
const getCategory = async (req = request, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id)
                           .populate('user', 'name');

    res.json({
        category
    });
}

// crear categoria
const postCategory = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    try {   

        const data = {
            name,
            user: req.user._id
        }

        const category = new Category(data);
            

        await category.save();

        res.status(201).json({
            category
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor',
            error
        })
    }
}

// actualizar categoria
const putCategory = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const name = req.body.name.toUpperCase();

        const data = {
            name,
            user: req.user._id
        };

        const category = await Category.findByIdAndUpdate(id, data, {new : true})
            .populate('user', 'name');
        
        res.json({
            category
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor',
            error
        })
    }
}

// borrarCategoria - estado : false 
const deleteCategory = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const data = {
            state: false
        };

        const category = await Category.findByIdAndUpdate(id, data, {new : true});

        res.json({
            category
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor',
            error
        })
    }
}

module.exports = {
    postCategory,
    getCategories,
    getCategory,
    putCategory,
    deleteCategory
}